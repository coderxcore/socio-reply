import {messageTokens} from "../pre/messageTokens";
import {IDocumentBase} from "gs-search/type";
import {Search} from "./Search";
import {IMessageQuery} from "/src-com";

export async function searchMsg(query: IMessageQuery) {
	if (!query.text) return [];
	const doc = {
		...query,
		tokens: await messageTokens(query.text),
	} as IDocumentBase;
	return await Search.message.search(doc);
}
