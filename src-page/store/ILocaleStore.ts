import {defineStore} from "pinia";
import {Api} from "../api";
import {LocaleObject, LocaleRecord} from "/src-com";

export interface ILocaleState extends LocaleRecord {
}

export interface ILocaleActions {

	loadLocaleTexts(setTitle?: boolean): Promise<void>;

	reLoadLocaleTexts(setTitle?: boolean): Promise<void>;

	setPageTitle(): void;

}

export interface ILocaleStore extends ILocaleState, ILocaleActions {
}

export const useLocaleStore: () => ILocaleStore = () => new Proxy(defineStore('locale', {
	state: (): ILocaleState => {
		return {...LocaleObject};
	},
	actions: <ILocaleActions>{
		async loadLocaleTexts(setTitle?: boolean) {
			this.$patch(await Api.locale.getMessages());
			setTitle && this.setPageTitle();
		},
		async reLoadLocaleTexts(setTitle?: boolean) {
			await Api.locale.clearMessageCache();
			await this.loadMessages(setTitle);
		},
		setPageTitle() {
			document.title = this.title
		}
	}
})(), {
	get(target, p, obj) {
		if (p in obj || p === '__v_isRef') {
			return Reflect.get(target, p, obj);
		}
		return p;
	}
}) as any;
