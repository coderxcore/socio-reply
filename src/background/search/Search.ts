// import {ISearchEngineConfig, SearchEngine} from "gs-search";
// import {IMessage} from "/src-com";

// const messageTokenize: ISearchEngineConfig['indexingTokenizer'] = (msg: Document): string[] => {
// 	return [];
// }

// export class Search {
//
// 	static #message: SearchEngine
//
// 	static #termPrefix: SearchEngine;
//
// 	static #termFuzzy: SearchEngine;
//
// 	static get message() {
// 		return this.#message || (this.#message = new SearchEngine({baseDir: 'message'}));
// 	}
//
// 	static get termPrefix() {
// 		return this.#termPrefix || (this.#termPrefix = new SearchEngine({baseDir: 'term-prefix'}));
// 	}
//
// 	static get termFuzzy() {
// 		return this.#termFuzzy || (this.#termFuzzy = new SearchEngine({baseDir: 'term-fuzzy'}));
// 	}
// }
