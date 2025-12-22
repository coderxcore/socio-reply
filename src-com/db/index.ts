import {IDataWriter, IDbPro, IIDbPro} from "gs-idb-pro";
import {localesStoreSchema} from "./locales/LocalesStoreSchema";
import {ILocaleRow} from "./locales/ILocaleRow";

export * from "./locales/ILocaleRow";

let currentDb: IIDbPro | undefined;

export class Db {

	static settings = Db.db.map('settings')
	static locales: IDataWriter<ILocaleRow> = Db.db.store(localesStoreSchema,'locale');

	static get db(): IIDbPro {
		console.log(localesStoreSchema)
		return currentDb || (currentDb = new IDbPro({
			name: 'socio-reply'
		}));
	}

}