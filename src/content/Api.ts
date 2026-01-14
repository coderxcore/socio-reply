import {createMsgMethodProxy} from "gs-br-ext";
import {IContentToBgService} from "/src-com";

export class Api {

	static #proxy?: any;

	static get contentToBg(): IContentToBgService {
		return this.#api
	}

	static get #api(): any {
		return this.#proxy || (this.#proxy = createMsgMethodProxy<any>(true));
	}
}
