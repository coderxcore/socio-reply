import {ILocaleStore, useLocaleStore} from "./ILocaleStore";
import {ISettingsStore, useSettingsStore} from "./ISettringsStore";
import {IMessageStore, useMessageStore} from "./IMessageStore";
import {IImportReferencesStore, useImportReferencesStore} from "./IImportReferencesStore";
import {IFrontStore, useFrontStore} from "./IFrontStore";

export class Store {

	static #replyStore?: IMessageStore
	static #localeStore?: ILocaleStore
	static #settingsStore?: ISettingsStore
	static #importReferencesStore?: IImportReferencesStore
	static #frontStore?: IFrontStore

	static get front(): IFrontStore {
		return this.#frontStore || (this.#frontStore = useFrontStore());
	}

	static get message(): IMessageStore {
		return this.#replyStore || (this.#replyStore = useMessageStore());
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
