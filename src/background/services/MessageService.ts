import {setMsgMethod} from "gs-br-ext";
import {IMessage, IMessageQuery, IMessageService, ISearchMessage} from "/src-com";
import {clearMessageStatusCache, messageStatus} from "../repo/messageStatus";
import {Db} from "../db";
import {Bool} from "gs-idb-basic";
import {setTmpMessage} from "../input/InputStatus";
import {updateIndex} from "../search/updateIndex";
import {getSettings} from "./SettingsService";
import {saveMessagePack} from "../repo/saveMessagePack";
import {preprocessMessages} from "../pre/preprocessMessage";
import {queryMessageOnDb} from "../repo/queryMessageOnDb";
import {queryMessageBySearch} from "../repo/queryMessageBySearch";
import {searchMsg} from "../search/searchMsg";

setMsgMethod<IMessageService>({
	clearMessageStatusCache,
	messageStatus,
	async loadMessage(query: IMessageQuery): Promise<Partial<ISearchMessage>[]> {
		if (query.text) {
			const results = await searchMsg(query);
			// console.log(results)
			return await queryMessageBySearch(results, query);
		}
		return await queryMessageOnDb(query);
	},
	async sendMessageToContent(msg: string): Promise<void> {
		try {
			await setTmpMessage(msg);
		} catch (e) {
			console.warn(e)
		}
	},
	removeMessage(id: number): Promise<void> {
		clearMessageStatusCache();
		return Db.message.delete(id)
	},
	async addMessage(msg: IMessage): Promise<any> {
		const {minSaveLength} = await getSettings();
		if (msg.text.length < minSaveLength) {
			throw new Error(`msg.text.length should be greater than ${minSaveLength}`);
		}
		msg.is_reference = Bool.True;
		const addedResult = await saveMessagePack(await preprocessMessages([msg]))
		clearMessageStatusCache();
		return {
			addedResult,
			indexResult: await updateIndex()
		}
	}
})
