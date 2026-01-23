import {
	IDataApi,
	IImportApi,
	ISpecialCaseApi,
	ILocaleApi,
	IMessageApi,
	ISceneApi,
	ITermApi,
	ISettingsApi,
	IMsgMgrApi
} from "/src-com";
import {createMsgMethodProxy} from "gs-br-ext";


export class Api {

	static #proxy?: any;

	static get msgMgr(): IMsgMgrApi {
		return this.#api;
	}

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

	static get specialCase(): ISpecialCaseApi {
		return this.#api
	}

	static get search(): ITermApi {
		return this.#api
	}

	static get #api(): any {
		return this.#proxy || (this.#proxy = createMsgMethodProxy<any>(true));
	}
}
