import {defaultStoreSchemaTemplate, IDataOperators, IDataReader, IDataWriter, IDbPro, IIDbPro} from "gs-idb-pro";
import {ILocaleRow, IMessage, IScene, ITerm} from "/src-com";
import {localeStoreSchema} from "./localeStoreSchema";
import {messageSchema, MessageStoreName} from "./messageSchema";
import {termSchema, TermStoreName} from "./termSchema";
import {sceneSchema} from "./sceneSchema";

const dbName = 'message-assistant'

let currentDb: IIDbPro | undefined;

export class Db {

	static locale: IDataWriter<ILocaleRow> = Db.db.store(localeStoreSchema, 'locale');
	// static draft: IDataWriter<IMessage> = Db.db.store(draftSchema);
	static message: IDataWriter<IMessage> = Db.db.store(messageSchema);

	static msgDeleted: IDataWriter<IMessage> = this.message.index('deleted',true)
	static msgContentDeleted: IDataReader<IMessage> = this.message.index('is_content_deleted')
	static msgReferenceDeleted: IDataReader<IMessage> = this.message.index('is_reference_deleted')

	static term: IDataWriter<ITerm> = Db.db.store(termSchema);
	static scene: IDataWriter<IScene> = Db.db.store(sceneSchema);

	// static msgAndDraft: IDataOperators<ITerm, IMessage> = Db.db.stores([MessageStoreName, DraftStoreName])

	static termHashAndMsgHash: IDataOperators<ITerm, IMessage> = Db.db.stores([
		{
			store: TermStoreName,
			index: 'hash'
		},
		{
			store: MessageStoreName,
			index: 'hash'
		}
	])

	static get db(): IIDbPro {
		return currentDb || (currentDb = new IDbPro({
			name: dbName,
			version: 1,
			storeTemplate: {
				...defaultStoreSchemaTemplate,
				addedTimeField: false,
				updatedTimeField: false,
			}
		}));
	}

}
