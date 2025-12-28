import {ILocaleStore, useLocaleStore} from "./ILocaleStore";
import {ISettingsStore, useSettingsStore} from "./ISettringsStore";
import {IReplyStore, useReplyStore} from "./IReplyStore";

export class Store {
	static #replyStore?: IReplyStore
	static #localeStore?: ILocaleStore
	static #settingsStore?: ISettingsStore

	static get reply(): IReplyStore {
		return Store.#replyStore || (Store.#replyStore = useReplyStore());
	}

	static get locale(): ILocaleStore {
		return Store.#localeStore || (Store.#localeStore = useLocaleStore());
	}

	static get settings(): ISettingsStore {
		return Store.#settingsStore || (Store.#settingsStore = useSettingsStore());
	}
}
