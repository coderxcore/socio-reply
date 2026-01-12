import {IndexUpdatePayload} from "./IndexUpdatePayload";
import {Db} from "../db";
import {Search} from "./Search";
import {keyGt, keyGte} from "gs-idb-basic";
import {toJson} from "gs-base";

export async function updateIndex() {
	const history = await IndexUpdatePayload.get();
	if (!history) {
		return;
	}
	const {msgFromId, termFromId} = history;
	try {
		if (msgFromId > 0) {
			await updateMsgIndex(msgFromId, termFromId);
		}
		if (termFromId > 0) {
			await updateTermIndex(termFromId);
		}
		await IndexUpdatePayload.clear();
	} catch (e) {
		console.error(e)
		throw new Error(await toJson({history, new: await IndexUpdatePayload.get(), error: e.message}));
	}

	return {history, new: await IndexUpdatePayload.get()}
}

async function updateMsgIndex(msgFromId: number, termFromId: number) {
	try {
		Search.message.startBatch();
		let result = await Db.message.all(keyGte(msgFromId) as any, 100)
		if (result[result.length - 1]?.id !== msgFromId) while (result.length) {
			msgFromId = result[result.length - 1].id;
			await Search.message.addDocumentsIfMissing(result as any);
			await IndexUpdatePayload.replace({msgFromId, termFromId});
			result = await Db.message.all(keyGt(msgFromId) as any, 100)
		}
		await IndexUpdatePayload.replace({msgFromId: undefined, termFromId});
	} finally {
		await Search.message.endBatch();
	}
}

async function updateTermIndex(termFromId: number) {
	try {
		Search.termPrefix.startBatch();
		Search.termFuzzy.startBatch();
		let result = await Db.term.all(keyGte(termFromId) as any, 100)
		while (result.length) {
			termFromId = result[result.length - 1].id;
			await Search.termPrefix.addDocumentsIfMissing(result as any);
			await Search.termFuzzy.addDocumentsIfMissing(result as any);
			await IndexUpdatePayload.replace({msgFromId: undefined, termFromId});
			result = await Db.term.all(keyGt(termFromId) as any, 100)
		}
	} finally {
		try {
			await Search.termPrefix.endBatch();
		} finally {
			await Search.termFuzzy.endBatch();
		}
	}
}
