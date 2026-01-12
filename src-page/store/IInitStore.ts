import {defineStore} from "pinia";
import {BuiltInSceneKey, BuiltInSceneKeys, Locale, Locales} from "/src-com";
import {StorageLocal} from "gs-br-ext";
import {copyObject} from "gs-base";

const InitStorageKey = 'init-store';

export interface IInitState {
	savedData: Record<Locale, BuiltInSceneKey[]>
	forceShow: boolean;
	selectedMap: Map<Locale, BuiltInSceneKey[]>
}

export interface IInitGetters {
	initialized: boolean
	showInit: boolean
	unImportedData: Record<Locale, BuiltInSceneKey[]>
	isFullImported: boolean
	allLangSelected: boolean
}

export interface IInitActions {
	loadInitData(): Promise<void>

	saveInitData(): Promise<void>

	hideInit(): void;

	toggleSelectAllLang(): void;

	toggleSelectLang(lang: Locale): void;

	toggleSelectAllScene(lang: Locale): void;

	toggleSelectScene(lang: Locale, sceneKey: BuiltInSceneKey): void;

	addSaveData(lang: Locale, sceneKey: BuiltInSceneKey, isSave?: boolean)

}

export interface IInitStore extends IInitState, IInitGetters, IInitActions {
}

export const useInitStore: () => IInitStore = defineStore(InitStorageKey, {
	state: (): IInitState => {
		return {
			savedData: {} as Record<Locale, BuiltInSceneKey[]>,
			forceShow: false,
			selectedMap: new Map<Locale, BuiltInSceneKey[]>(),
		}
	},
	getters: {
		unImportedData: ({savedData}: IInitStore): Record<Locale, BuiltInSceneKey[]> => {
			const status = {} as Record<Locale, BuiltInSceneKey[]>;
			for (const lang of Locales) {
				for (const key of BuiltInSceneKeys) {
					if (!savedData?.[lang]?.includes?.(key)) {
						status[lang] || (status[lang] = []);
						status[lang].push(key);
					}
				}
			}
			return status;
		},
		initialized: ({savedData}: IInitStore): boolean => {
			return !!savedData;
		},
		showInit: ({forceShow, initialized}: IInitStore): boolean => {
			return forceShow || !initialized;
		},
		isFullImported: ({unImportedData}: IInitStore): boolean => {
			return Object.keys(unImportedData).length < 1;
		},
		allLangSelected: ({selectedMap, unImportedData}: IInitStore): boolean => {
			return selectedMap.size === Object.keys(unImportedData).length
		},
	},
	actions: <IInitActions>{
		async loadInitData() {
			this.savedData = await StorageLocal.getValue(InitStorageKey);
		},
		async saveInitData() {
			await StorageLocal.setValue(InitStorageKey, copyObject(this.savedData));
		},
		hideInit() {
			this.savedData || (this.savedData = {} as any);
			this.forceShow = false;
		},
		toggleSelectAllLang() {
			if (this.allLangSelected) {
				this.selectedMap.clear();
			} else {
				for (const [lang, keys] of Object.entries(this.unImportedData)) {
					this.selectedMap.set(lang, keys);
				}
			}
		},
		toggleSelectLang(lang: Locale) {
			if (this.selectedMap.has(lang)) {
				this.selectedMap.delete(lang);
			} else {
				this.selectedMap.set(lang, this.unImportedData[lang]);
			}
		},
		toggleSelectAllScene(lang: Locale) {
			if (this.selectedMap.get(lang)?.length === this.unImportedData[lang]?.length) {
				this.selectedMap.set(lang, []);
			} else {
				this.selectedMap.set(lang, this.unImportedData[lang]);
			}
		},
		toggleSelectScene(lang: Locale, sceneKey: BuiltInSceneKey) {
			const keys = this.selectedMap.get(lang) || [];
			if (keys.includes(sceneKey)) {
				this.selectedMap.set(lang, keys.filter(k => k !== sceneKey));
			} else {
				this.selectedMap.set(lang, [...keys, sceneKey]);
			}
		},
		addSaveData(lang: Locale, sceneKey: BuiltInSceneKey, isSave?: boolean) {
			const {savedData = {}} = this as IInitStore;
			const keys = savedData[lang] || [];
			keys.push(sceneKey);
			savedData[lang] = keys;
			this.savedData = savedData;
			if (isSave) {
				this.saveInitData();
			}
		},
	},
}) as any;
