import {setMsgMethod} from "gs-br-ext";
import {Bool} from "gs-idb-basic";
import {IMessage, IMessageService, IMessageStatus, ISearchReply} from "/src-com";
import {Db} from "../db";


let statusCache: IMessageStatus | undefined;

setMsgMethod<IMessageService>({
	clearStatusCache(): Promise<void> {
		return Promise.resolve(statusCache = undefined);
	},
	async messageStatus(): Promise<IMessageStatus> {
		if (statusCache) {
			return statusCache;
		}
		return statusCache = await Db.mesAndDraft.read(async (mes, draft) => ({
			draftCount: await draft.count(),
			historyCount: await mes.index('kind_deleted').count(['content', Bool.False]),
			trashCount: await mes.index('deleted').count(Bool.True),
			referencesCount: await mes.index('kind_deleted').count(['reference', Bool.False])
		}))
	}, queryReply(text: ISearchReply): Promise<IMessage[]> {
		return Promise.resolve([]);
	}, queryWord(text: string): Promise<string[]> {
		return Promise.resolve([]);
	}
})
