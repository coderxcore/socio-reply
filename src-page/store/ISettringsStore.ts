import {defineStore} from "pinia";
import {Api} from "../api";
import {Timer} from "gs-base";
import {defaultSettings, ISettings} from "/src-com";

const timer = new Timer()

export interface ISettingsState extends ISettings {
}

export interface ISettingsGetter {
	readonly realTheme: string;
}

export interface ISettingsStore extends ISettingsState, ISettingsGetter {
	loadSettings(): Promise<void>;

	saveSettings(): Promise<void>;

	setPageTheme(): void;
}

export const useSettingsStore: () => ISettingsStore = defineStore('settings', {
	state: (): ISettingsState => {
		return {...defaultSettings};
	},
	getters: {
		realTheme({theme}) {
			if (theme === 'auto') if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				theme = 'dark';
			} else {
				theme = 'light';
			}
			return theme;
		}
	},
	actions: {
		async loadSettings() {
			this.$patch(await Api.settings.getSettings());
			this.setPageTheme();
		},
		async saveSettings() {
			await timer.reWait();
			await Api.settings.setSettings({...this.$state});
		},
		setPageTheme() {
			document.documentElement.className = this.realTheme;
		}
	}
}) as any;
