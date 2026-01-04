import {IImportApi, ILocaleApi, IMessageApi, ISettingsApi} from "/src-com";
import {createMsgMethodProxy} from "gs-br-ext";


export class Api {

	static #proxy?: any;

	static get import(): IImportApi {
		return this.#api
	}

	static get message(): IMessageApi {
		return this.#api
	}

	static get settings(): ISettingsApi {
		return this.#api
	}

	static get locale(): ILocaleApi {
		return this.#api
	}

	static get #api(): any {
		return this.#proxy || (this.#proxy = createMsgMethodProxy<any>(true));
	}
}
