import {IMessage, IMessageQuery} from "/src-com";
import {IGetAllArgs} from "gs-idb-pro";
import {Bool} from "gs-idb-basic";
import {Db} from "../db";
import {isNumber} from "gs-base";

const DefaultCount = 30;

export async function queryMessageOnDb(query: IMessageQuery): Promise<IMessage[]> {
	const param: IGetAllArgs<any> = {count: DefaultCount, direction: 'prev'};
	if (isNumber(query.sceneId)) {
		if (query.is_content) {
			return await Db.message.index('sceneId_is_content_deleted')
				.all({query: [query.sceneId, Bool.True, Bool.False], ...param});
		}
		if (query.is_reference) {
			return await Db.message.index('sceneId_reference_deleted')
				.all({query: [query.sceneId, Bool.True, Bool.False], ...param});
		}
		return await Db.message.index('sceneId_deleted')
			.all({query: [query.sceneId, Bool.False], ...param});
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
}
