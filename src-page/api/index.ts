import {IDataApi, IImportApi, IIndexApi, ILocaleApi, IMessageApi, ISceneApi, ISearchApi, ISettingsApi} from "/src-com";
import {createMsgMethodProxy} from "gs-br-ext";


export class Api {

	static #proxy?: any;

	static get data(): IDataApi {
		return this.#api
	}

	static get import(): IImportApi {
		return this.#api
	}

	static get scene(): ISceneApi {
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

	static get index(): IIndexApi {
		return this.#api
	}

	static get search(): ISearchApi {
		return this.#api
	}

	static get #api(): any {
		return this.#proxy || (this.#proxy = createMsgMethodProxy<any>(true));
	}
}
