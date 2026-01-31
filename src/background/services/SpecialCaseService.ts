import {setMsgMethod, StorageLocal} from "gs-br-ext";
import {InitStorageKey, ISpecialCaseService} from "/src-com";
import {Search} from "../search/Search";
import {deleteDb} from "gs-idb-basic";
import {Db} from "../db";
import {updateIndex} from "../search/updateIndex";
import {IndexUpdatePayload} from "../search/IndexUpdatePayload";
import {clearMessageCache} from "./LocalService";

async function clearAllIndex() {
	try {
		await Search.message.clearAll();
	} catch (e: any) {
		console.error('resetAll failed', e);
	}
	try {
		await Search.termPrefix.clearAll();
	} catch (e: any) {
		console.error('resetAll failed', e);
	}
	try {
		await Search.termFuzzy.clearAll();
	} catch (e: any) {
		console.error('resetAll failed', e);
	}
}

setMsgMethod<ISpecialCaseService>({
	async fullRebuildIndex(): Promise<any> {
		await IndexUpdatePayload.replace({msgFromId: 1, termFromId: 1});
		await clearAllIndex();
		return await updateIndex();
	},
	async clearAllData(): Promise<any> {
		await clearAllIndex();
		await clearMessageCache();
		try {
			await StorageLocal.raw.remove(InitStorageKey);
		} catch (e: any) {
			console.log(e)
		}
		try {
			await IndexUpdatePayload.clear();
		} catch (e: any) {
			console.log(e)
		}
		try {
			const {name, version} = Db.db.schema;
			await deleteDb(name, version);
		} catch (e: any) {
			console.log(e)
		}
	},
	async updateIndex(): Promise<any> {
		return await updateIndex();
	},
})
