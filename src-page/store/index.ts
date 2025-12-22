import {ILocaleStore, useLocaleStore} from "./ILocaleStore";
import {ISettingsStore, useSettingsStore} from "./ISettringsStore";

export class Store {
	static #localeStore?: ILocaleStore
	static #settingsStore?: ISettingsStore

	static get locale(): ILocaleStore {
		return Store.#localeStore || (Store.#localeStore = useLocaleStore());
	}

	static get settings(): ISettingsStore {
		return Store.#settingsStore || (Store.#settingsStore = useSettingsStore());
	}
}