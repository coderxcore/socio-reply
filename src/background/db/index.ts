import {defaultStoreSchemaTemplate, IDataOperators, IDataWriter, IDbPro, IIDbPro} from "gs-idb-pro";
import {ILocaleRow, IMessage, IScene, IWord} from "/src-com";
import {localeStoreSchema} from "./localeStoreSchema";
import {messageSchema, MessageStoreName} from "./messageSchema";
import {wordSchema, WordStoreName} from "./wordSchema";
import {sceneSchema} from "./sceneSchema";
import {draftSchema, DraftStoreName} from "./draftSchema";

const dbName = 'message-assistant'

let currentDb: IIDbPro | undefined;

export class Db {

	static locale: IDataWriter<ILocaleRow> = Db.db.store(localeStoreSchema, 'locale');
	static draft: IDataWriter<IMessage> = Db.db.store(draftSchema);
	static message: IDataWriter<IMessage> = Db.db.store(messageSchema);
	static word: IDataWriter<IWord> = Db.db.store(wordSchema);
	static scene: IDataWriter<IScene> = Db.db.store(sceneSchema);

	static allMessage: IDataOperators<IWord, IMessage> = Db.db.stores([WordStoreName, MessageStoreName, DraftStoreName])
	static wordAndMessage: IDataOperators<IWord, IMessage> = Db.db.stores([WordStoreName, MessageStoreName])
	static wordAndDraft: IDataOperators<IWord, IMessage> = Db.db.stores([WordStoreName, DraftStoreName])
	static mesAndDraft: IDataOperators<IWord, IMessage> = Db.db.stores([MessageStoreName, DraftStoreName])

	static get db(): IIDbPro {
		return currentDb || (currentDb = new IDbPro({
			name: dbName,
			storeTemplate: {
				...defaultStoreSchemaTemplate,
				addedTimeField: false,
				updatedTimeField: false,
			}
		}));
	}

}
