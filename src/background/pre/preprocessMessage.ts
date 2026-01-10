import {IMessage, ITerm} from "/src-com";
import {hash} from "gs-search/core";
import {messageTokens} from "./messageTokens";
import {asyncMap} from "gs-base";
import {tokenizeMultiLang} from "./multiLangTokenizer";
import {IMessagePack} from "../type";


export async function preprocessMessages(messages: IMessage[]): Promise<IMessagePack> {
	messages = await asyncMap(messages, preprocessMessage);
	const terms: ITerm[] = [];
	const tokenSet = new Set<string>()
	let count = 0;
	for (let i = 0; i < messages.length; i++) {
		const tks = messages[i].tokens;
		for (let j = 0; j < tks.length; j++) {
			count++;
			if (tks[j].length > 1) tokenSet.add(tks[j])
		}
	}
	for (const tk of tokenSet) {
		const rs = tokenizeMultiLang(tk, {maxPrefix: 2, fuzzyKeepMultiWhenChar: true});
		for (let i = 0; i < rs.length; i++) {
			terms.push(rs[i])
		}
	}
	console.log(count, tokenSet.size, terms.length)
	return {
		messages,
		terms
	}
}

export async function preprocessMessage(msg: IMessage): Promise<IMessage> {
	msg.hash = hash(msg.text);
	msg.tokens = await messageTokens(msg.text);
	return msg;
}

