import {defaultStoreSchemaTemplate, IDataOperators, IDataWriter, IDbPro, IIDbPro} from "gs-idb-pro";
import {ILocaleRow, IReply, IScene, IWord} from "/src-type";
import {localeStoreSchema} from "./localeStoreSchema";
import {replySchema, ReplyStoreName} from "./replySchema";
import {wordSchema, WordStoreName} from "./wordSchema";
import {sceneSchema} from "./sceneSchema";

let currentDb: IIDbPro | undefined;

export class Db {

	static locale: IDataWriter<ILocaleRow> = Db.db.store(localeStoreSchema, 'locale');
	static reply: IDataWriter<IReply> = Db.db.store(replySchema);
	static word: IDataWriter<IWord> = Db.db.store(wordSchema);
	static scene: IDataWriter<IScene> = Db.db.store(sceneSchema);

	static wordAndReply: IDataOperators<IWord, IReply> = Db.db.stores([WordStoreName, ReplyStoreName])

	static get db(): IIDbPro {
		return currentDb || (currentDb = new IDbPro({
			name: 'socio-reply',
			storeTemplate: {
				...defaultStoreSchemaTemplate,
				addedTimeField: false,
				updatedTimeField: false,
			}
		}));
	}

}
