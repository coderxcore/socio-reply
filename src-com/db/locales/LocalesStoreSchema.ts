import {IStoreSchema} from "gs-idb-pro";
import {ILocaleRow, LocalesAll, LocaleKey, LocaleRecord} from "./ILocaleRow";
import {zh_CN} from "./default-values/zh_CN";
import {all} from "./default-values/all";
import {zh_TW} from "./default-values/zh_TW";
import {ja} from "./default-values/ja";
import {en} from "./default-values/en";

export const localesStoreSchema: IStoreSchema = {
	name: 'locales',
	addedTimeField: false,
	updatedTimeField: false,
	indexSchemas: [
		'locale',
		{
			name: 'locale_key',
			keyPath: ['locale', 'key'],
			unique: true
		}
	],
	defaultData: [
		...toData(all, 'all'),
		...toData(zh_CN, 'zh-CN'),
		...toData(zh_TW, 'zh-TW'),
		...toData(ja, 'ja'),
		...toData(en, 'en')
	]
}

function toData(record: LocaleRecord, locale: LocalesAll): ILocaleRow[] {
	return Object.entries(record).map(([key, value]) => ({key, locale, value}));
}