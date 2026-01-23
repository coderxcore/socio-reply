import {IResult} from "gs-search/type";
import {IMessage, IMessageQuery, ISearchMessage} from "/src-com";
import {Db} from "../db";
import {Bool} from "gs-idb-basic";
import {murmur3_32} from "gs-search/core";

export async function queryMessageBySearch(results: IResult[], query: IMessageQuery): Promise<ISearchMessage[]> {
	const {text, sceneId, is_reference, is_content} = query
	if (!results.length || !text) return [];
	const hash = murmur3_32(text.trim())
	return await Db.message.batchRead(async store => {
		const msgs: ISearchMessage[] = [];
		let isHashFind = false;
		for (const result of results) {
			const msg = await store.get(result.id) as Required<IMessage>;
			if (
				!msg?.text
				|| msg.deleted === Bool.True
				|| sceneId > 0 && msg.sceneId !== sceneId
				|| is_content !== undefined && msg.is_content !== is_content
				|| is_reference !== undefined && msg.is_reference !== is_reference
				|| !result.tokens.some(t => msg.text.includes(t))
			) {
				continue
			}
			delete msg.tokens
			if (msg.hash === hash || msg.text === text) {
				isHashFind = true;
			}
			msgs.push({
				...msg,
				searchedTokens: result.tokens
			} as any);
			if (msgs.length > 30) break;
		}
		if (!isHashFind) {
			const dbMsgs = await store.index('hash').getRange(hash);
			const msg = dbMsgs.find(m => m.text === text);
			if (msg) {
				msgs.unshift(msg as any);
			}
		}
		return msgs;
	})
}
