import {Db} from "../db";
import {IMessagePack} from "../type";
import {IndexStatus} from "../search/IndexStatus";

export async function saveMessagePack(pack: IMessagePack): Promise<any> {
	const {termAndMessage} = Db
	const {terms, messages} = pack;
	return await termAndMessage.write(async (ts, ms) => {
		const termStart = await ts.add(terms[0]);
		await ts.addMany(terms.slice(1));
		const messageStart = await ms.add(messages[0]);
		await ms.addMany(messages.slice(1));
		return await IndexStatus.markStart({messageId: messageStart.id, termId: termStart.id});
	})
}
