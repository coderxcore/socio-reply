import {ILocaleApi, IReplyApi, ISettingsApi} from "../../src-com";
import {createMsgMethodProxy} from "gs-br-ext";


export class Api {

	static #proxy?: any;

	static get reply(): IReplyApi {
		return this.#api
	}

	static get settings(): ISettingsApi {
		return this.#api
	}

	static get locale(): ILocaleApi {
		return this.#api
	}

	static get #api(): any {
		return Api.#proxy || (Api.#proxy = createMsgMethodProxy<any>(true));
	}
}
