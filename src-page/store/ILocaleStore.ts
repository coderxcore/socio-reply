import {defineStore} from "pinia";
import {Api} from "../api";
import {LocaleObject, LocaleRecord} from "/src-com";

export interface ILocaleState extends LocaleRecord {
}

export interface ILocaleStore extends ILocaleState {
	loadMessages(setTitle?: boolean): Promise<void>;

	reLoadMessages(setTitle?: boolean): Promise<void>;

	setPageTitle(): void;
}

export const useLocaleStore: () => ILocaleStore = () => new Proxy(defineStore('locale', {
	state: (): ILocaleState => {
		return {...LocaleObject};
	},
	actions: {
		async loadMessages(setTitle?: boolean) {
			this.$patch(await Api.locale.getMessages());
			setTitle && this.setPageTitle();
		},
		async reLoadMessages(setTitle?: boolean) {
			await Api.locale.clearMessageCache();
			await this.loadMessages(setTitle);
		},
		setPageTitle() {
			document.title = this.title
		}
	}
})(), {
	get(target, p, obj) {
		if(p in obj||p==='__v_isRef') {
			return Reflect.get(target, p, obj);
		}
		return p;
	}
}) as any;
