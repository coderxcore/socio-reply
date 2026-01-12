import {messageTokens} from "../pre/messageTokens";
import {IDocumentBase} from "gs-search/type";
import {Search} from "./Search";

export async function searchMsg(text: string) {
	const doc = {
		text,
		tokens: await messageTokens(text),
	} as IDocumentBase;
	return await Search.message.search(doc);
}
