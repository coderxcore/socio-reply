import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {Locale} from "../db";

export const themes = ['auto', 'light', 'dark'] as const;

export type Theme = typeof themes[number];

export interface ISettings {
	language?: Locale
	theme?: Theme
	minSaveLength?: number
	applyToSearch?: boolean
	keyDoubleDelay?: number
	enableAutoFirstInput?: boolean
	autoFirstDelay?: number
	lockAutoKey?: boolean
}

export const defaultSettings: Readonly<ISettings> = Object.freeze({
	language: 'zh-CN',
	theme: 'auto',
	minSaveLength: 10,
	applyToSearch: false,
	keyDoubleDelay: 300,
	enableAutoFirstInput: false,
	autoFirstDelay: 800
})

interface ISettingsBase {

	getSettings(): Promise<Required<ISettings>>;

	setSettings(settings: ISettings): Promise<Required<ISettings>>;
}

export interface ISettingsApi extends ISettingsBase, RemoteMethods {
}

export interface ISettingsService extends ISettingsBase, MsgMethods {
}
