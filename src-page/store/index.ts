import {ILocaleStore, useLocaleStore} from "./ILocaleStore";
import {ISettingsStore, useSettingsStore} from "./ISettringsStore";
import {IMessageStore, useMessageStore} from "./IMessageStore";
import {IImportReferencesStore, useImportReferencesStore} from "./IImportReferencesStore";
import {IFrontStore, useFrontStore} from "./IFrontStore";
import {ISceneStore, useSceneStore} from "./ISceneStore";
import {IInitStore, useInitStore} from "./IInitStore";

export class Store {

	static #messageStore?: IMessageStore
	static #localeStore?: ILocaleStore
	static #settingsStore?: ISettingsStore
	static #importReferencesStore?: IImportReferencesStore
	static #frontStore?: IFrontStore
	static #sceneStore?: ISceneStore;
	static #initStore: IInitStore;

	static get init(): IInitStore {
		return this.#initStore || (this.#initStore = useInitStore());
	}

	static get scene(): ISceneStore {
		return this.#sceneStore || (this.#sceneStore = useSceneStore());
	}

	static get front(): IFrontStore {
		return this.#frontStore || (this.#frontStore = useFrontStore());
	}

	static get message(): IMessageStore {
		return this.#messageStore || (this.#messageStore = useMessageStore());
	}

	static get locale(): ILocaleStore {
		return this.#localeStore || (this.#localeStore = useLocaleStore());
	}

	static get settings(): ISettingsStore {
		return this.#settingsStore || (this.#settingsStore = useSettingsStore());
	}

	static get importReferences(): IImportReferencesStore {
		return this.#importReferencesStore || (this.#importReferencesStore = useImportReferencesStore());
	}

}
