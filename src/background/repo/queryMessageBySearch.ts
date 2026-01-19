import {IResult} from "gs-search";
import {IMessage, IMessageQuery, ISearchMessage} from "/src-com";
import {Db} from "../db";
import {Bool} from "gs-idb-basic";

export async function queryMessageBySearch(results: IResult[], query: IMessageQuery): Promise<ISearchMessage[]> {
	const {text, sceneId, is_reference, is_content} = query
	if (!results.length || !text) return [];
	return await Db.message.batchRead(async store => {
		const msgs: ISearchMessage[] = [];
		for (const result of results) {
			const msg = await store.get(result.id) as Required<IMessage>;
			if (
				!msg?.text
				|| msg.deleted === Bool.True
				|| sceneId > 0 && msg.sceneId !== sceneId
				|| is_content !== undefined && msg.is_content !== is_content
				|| is_reference !== undefined && msg.is_reference !== is_reference
				|| msg.text === text
				|| !result.tokens.some(t => msg.text.includes(t))
			) {
				continue
			}
			delete msg.tokens
			msgs.push({
				...msg,
				searchedTokens: result.tokens
			} as any);
			if (msgs.length > 30) break;
		}
		return msgs;
	})
}
