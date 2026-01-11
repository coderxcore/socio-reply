import {IDocumentBase, ISearchEngine, ISearchEngineOption} from "gs-search/type";
import {SearchEngine} from "gs-search/core";
import {BrowserStorage} from "gs-search/browser";
import {IMessage, ITerm, safeSlice} from "/src-com";
import {messageTokens} from "../pre/messageTokens";
import {buildFuzzy, buildPrefix} from "../pre/multiLangTokenizer";

function arrayToLower(arr: string[]): string[] {
	for (let i = 0, len = arr.length; i < len; i++) {
		arr[i] = arr[i].toLowerCase();
	}
	return arr;
}

export class Search {

	static #message: ISearchEngine

	static #termPrefix: ISearchEngine;

	static #termFuzzy: ISearchEngine;

	static get message() {
		return this.#message || (this.#message = new SearchEngine({
			storage: new BrowserStorage('message'),
			indexingTokenizer: (doc) => {
				const msg = doc as IMessage;
				return ([...(msg.keywords || []), ...(msg.tokens || [])]);
			}
		}));
	}

	static get termPrefix() {
		return this.#termPrefix || (this.#termPrefix = new SearchEngine({
			storage: new BrowserStorage('term-prefix'),
			indexingTokenizer: doc => arrayToLower((doc as ITerm).prefix || [])
			// indexingTokenizer: doc => {
			// 	const r = arrayToLower((doc as ITerm).prefix || []);
			// 	console.log(doc, r)
			// 	return r;
			// }
		}));
	}

	static get termFuzzy() {
		return this.#termFuzzy || (this.#termFuzzy = new SearchEngine({
			storage: new BrowserStorage('term-fuzzy'),
			indexingTokenizer: doc => arrayToLower((doc as ITerm).fuzzy || [])
			// indexingTokenizer: doc => {
			// 	const r = arrayToLower((doc as ITerm).fuzzy || []);
			// 	console.log(doc, r)
			// 	return r;
			// }
		}));
	}

	static async searchTerm(text: string) {
		const suffix = safeSlice(text, -2);
		const term = {
			text: suffix,
			prefix: [suffix, ...buildPrefix(suffix, 2)]
		}
		const result = await this.termPrefix.search(term as any);
		if (result?.length > 0) {
			return result;
		}
		const term2 = {
			text,
			fuzzy: [suffix, ...buildFuzzy(suffix, {} as any)],
		}
		return await this.termFuzzy.search(term2 as any);
	}

	static async searchMsg(text: string) {
		const doc = {
			text,
			tokens: await messageTokens(text),
		} as IDocumentBase;
		return await this.message.search(doc as any);
	}
}
