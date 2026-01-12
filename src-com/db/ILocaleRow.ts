import {themes} from "../api/ISettingsApi";

const settingsPageKeys = [
	'language', 'languageDesc', 'theme', 'themeDesc', 'pref',
	'ok','cancel','selectAll',
	'dataMgr', 'exportData', 'exportDataDesc', 'importData', 'importDataDesc',
	'importReferences', 'mode', 'preview','confirmImport','emptyContent','loading','importing','imported','importError','askImport',
	'import_fileReading','import_dbSaving','import_indexing','import_done',
	'scene','importAs','genericScene','genericSceneDesc','aiScene','aiSceneDesc','socioScene','socioSceneDesc','videoScene','videoSceneDesc',
	'shoppingScene','shoppingSceneDesc','initTitle','initSubtitle','importCustomReference','selectImportLanguage','selectScene','import',
	'aiScene','ecommerceScene',
] as const;

export const importModes = ['blankLine', 'eachLine', 'custom'] as const;

export const Locales = ['zh-CN', 'zh-TW', 'en', 'ja'] as const;

export const LocaleKeys = [
	'title', 'settings', 'home', 'draft', 'trash', 'history', 'references',
	...settingsPageKeys,
	...themes,
	...importModes,
] as const;

export type ImportMode = typeof importModes[number];

export type Locale = typeof Locales[number];

export type LocalesAll = Locale | 'all';

export type LocaleKey = typeof LocaleKeys[number] | Locale

export interface ILocaleRow {
	id?: number
	key: LocaleKey
	locale: LocalesAll
	value: string
}

export type LocaleRecord = Record<LocaleKey, string>

export const LocaleObject: LocaleRecord = (() => {
	const obj: any = {};
	for (const locale of [...Locales, ...LocaleKeys]) {
		obj[locale] = locale
	}
	return obj;
})()
