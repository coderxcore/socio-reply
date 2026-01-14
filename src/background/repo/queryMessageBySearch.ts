import {IResult} from "gs-search";
import {IMessage, ISearchMessage} from "/src-com";
import {Db} from "../db";
import {Bool} from "gs-idb-basic";

export async function queryMessageBySearch(results: IResult[], text: string): Promise<ISearchMessage[]> {
	return await Db.message.batchRead(async store => {
		const msgs: ISearchMessage[] = [];
		for (const result of results) {
			const msg = await store.get(result.id) as Required<IMessage>;
			if (
				msg
				&& msg.deleted != Bool.True
				&& result.tokens.some(t => msg.text.includes(t))
				&& msg.text !== text
			) {
				delete msg.tokens
				msgs.push({
					...msg,
					searchedTokens: result.tokens
				} as any);
			}
		}
		return msgs;
	})
}
