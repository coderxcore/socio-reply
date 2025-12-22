import {MsgMethods, RemoteMethods} from "gs-br-ext";
import {Locale} from "../db";

export const themes = ['auto', 'light', 'dark'] as const;

export type Theme = typeof themes[number];

export interface ISettings {
	language?: Locale
	theme?: Theme
}

export const defaultSettings: Readonly<ISettings> = Object.freeze({
	language: 'zh-CN',
	theme: 'auto'
})

interface ISettingsBase {

	getSettings(): Promise<ISettings>;

	setSettings(settings: Partial<ISettings>): Promise<ISettings>;
}

export interface ISettingsApi extends ISettingsBase, RemoteMethods {
}

export interface ISettingsService extends ISettingsBase, MsgMethods {
}