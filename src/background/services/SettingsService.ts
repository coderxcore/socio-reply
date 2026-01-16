import {setMsgMethod, StorageSync} from "gs-br-ext";
import {defaultSettings, ISettings, ISettingsService} from "/src-com";

const SettingsKey = 'settings';
let settingsCache: ISettings | undefined;

export const SettingsService: ISettingsService = Object.freeze({

	async getSettings(): Promise<ISettings> {
		return settingsCache || (settingsCache = {
			...defaultSettings,
			...await StorageSync.getValue(SettingsKey) as any
		});
	},

	async setSettings(settings: Partial<ISettings>): Promise<ISettings> {
		settingsCache = {...settingsCache, ...settings};
		await StorageSync.setValue(SettingsKey, settingsCache);
		return settingsCache;
	}
})

setMsgMethod<ISettingsService>(SettingsService)
