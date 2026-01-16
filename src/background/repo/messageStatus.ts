import {IMessageStatus} from "/src-com";
import {Db} from "../db";
import {Bool} from "gs-idb-basic";

let messageStatusCache: IMessageStatus | undefined;

export async function messageStatus(): Promise<IMessageStatus> {
	if (messageStatusCache) {
		return messageStatusCache;
	}
	return messageStatusCache = await Db.message.batchRead(async (msg) => ({
		// draftCount: await draft.count(),
		historyCount: await msg.index('is_content_deleted').count([Bool.True, Bool.False]),
		trashCount: await msg.index('deleted').count(Bool.True),
		referencesCount: await msg.index('is_reference_deleted').count([Bool.True, Bool.False])
	}))
	// return messageStatusCache = await Db.msgAndDraft.read(async (mes, draft) => ({
	// 	// draftCount: await draft.count(),
	// 	historyCount: await mes.index('is_content_deleted').count([Bool.True, Bool.False]),
	// 	trashCount: await mes.index('deleted').count(Bool.True),
	// 	referencesCount: await mes.index('is_reference_deleted').count([Bool.True, Bool.False])
	// }))
}

export function clearMessageStatusCache(): void {
	messageStatusCache = undefined;
}
