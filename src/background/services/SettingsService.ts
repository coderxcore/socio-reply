import {setMsgMethod, StorageSync} from "gs-br-ext";
import {defaultSettings, ISettings, ISettingsService, Locale} from "/src-com";

const SettingsKey = 'settings';
let cache: ISettings | undefined;

export const SettingsService: ISettingsService = Object.freeze({

	async getSettings(): Promise<ISettings> {
		return cache || (cache = {
			...defaultSettings,
			...await StorageSync.getValue(SettingsKey) as any
		});
	},

	async setSettings(settings: Partial<ISettings>): Promise<ISettings> {
		cache = {...cache, ...settings};
		await StorageSync.setValue(SettingsKey, cache);
		return cache;
	}
})

setMsgMethod<ISettingsService>(SettingsService)
