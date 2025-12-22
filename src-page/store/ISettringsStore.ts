import {defineStore} from "pinia";
import {defaultSettings, ISettings} from "/src-com";
import {Api} from "../api";
import {Timer} from "gs-base";

const timer = new Timer()

export interface ISettingsState extends ISettings {
}

export interface ISettingsStore extends ISettingsState {
	loadSettings(): Promise<void>;

	saveSettings(): Promise<void>;

	setPageTheme(): void;
}

export const useSettingsStore: () => ISettingsStore = defineStore('settings', {
	state: (): ISettingsState => {
		return {...defaultSettings};
	},
	actions: {
		async loadSettings() {
			this.$patch(await Api.settings.getSettings());
			this.setPageTheme();
		},
		async saveSettings() {
			await timer.reWait();
			const {language, theme} = this;
			await Api.settings.setSettings({
				language,
				theme
			})
		},
		setPageTheme() {
			let {theme} = this;
			if (theme === 'auto') if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				theme = 'dark';
			} else {
				theme = 'light';
			}
			document.documentElement.className = theme;
		}
	}
}) as any;