import {ILocaleStore, useLocaleStore} from "/src-page/store/ILocaleStore";
import {ISettingsStore, useSettingsStore} from "/src-page/store/ISettingsStore";
import {IFrontStore, useFrontStore} from "/src-page/store/IFrontStore";
import {ISceneStore, useSceneStore} from "/src-page/store/ISceneStore";
import {IInitStore, useInitStore} from "/src-page/store/IInitStore";
import {INotifyStore, useNotifyStore} from "/src-page/store/INotifyStore";

export class ContentStore {

	static #localeStore?: ILocaleStore
	static #settingsStore?: ISettingsStore
	static #frontStore?: IFrontStore
	static #sceneStore?: ISceneStore;
	static #initStore?: IInitStore;
	static #notifyStore?: INotifyStore;

	static get notify(): INotifyStore {
		return this.#notifyStore || (this.#notifyStore = useNotifyStore());
	}

	static get init(): IInitStore {
		return this.#initStore || (this.#initStore = useInitStore());
	}

	static get scene(): ISceneStore {
		return this.#sceneStore || (this.#sceneStore = useSceneStore());
	}

	static get front(): IFrontStore {
		return this.#frontStore || (this.#frontStore = useFrontStore());
	}


	static get locale(): ILocaleStore {
		return this.#localeStore || (this.#localeStore = useLocaleStore());
	}

	static get settings(): ISettingsStore {
		return this.#settingsStore || (this.#settingsStore = useSettingsStore());
	}

}
