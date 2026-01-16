import {setMsgMethod} from "gs-br-ext";
import {IMessage, IMessageQuery, IMessageService} from "/src-com";
import {clearMessageStatusCache, messageStatus} from "../repo/messageStatus";
import {Db} from "../db";
import {isNumber} from "gs-base";
import {IGetAllArgs} from "gs-idb-pro";
import {Bool} from "gs-idb-basic";
import {setTmpMessage} from "../input/InputStatus";

const DefaultCount = 30;

setMsgMethod<IMessageService>({
	clearMessageStatusCache,
	messageStatus,
	async loadMessage(query: IMessageQuery): Promise<IMessage[]> {
		const param: IGetAllArgs<any> = {count: DefaultCount, direction: 'prev'};
		if (!query || Object.keys(query).length < 1) {
			try {

				return await Db.message.index('deleted').all({query: Bool.False, ...param});
			} catch (e) {
				console.warn(e);
				return [];
			}
		}
		if (isNumber(query.sceneId)) {
			if (query.is_content && query.is_reference) {
				return await Db.message.index('sceneId_deleted')
					.all({query: [query.sceneId, Bool.False], ...param});
			}
			if (query.is_content) {
				return await Db.message.index('sceneId_is_content_deleted')
					.all({query: [query.sceneId, Bool.True, Bool.False], ...param});
			}
			if (query.is_reference) {
				return await Db.message.index('sceneId_reference_deleted')
					.all({query: [query.sceneId, Bool.True, Bool.False], ...param});
			}
		}
		if (query.is_content) {
			return await Db.message.index('is_content_deleted')
				.all({query: [Bool.True, Bool.False], ...param});
		}
		if (query.is_reference) {
			return await Db.message.index('is_reference_deleted')
				.all({query: [Bool.True, Bool.False], ...param});
		}
		return await Db.message.index('deleted').all({query: Bool.False, ...param});
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
	}

})
