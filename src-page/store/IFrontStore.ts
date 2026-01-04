import {defineStore} from "pinia";

export interface IFrontState {
	showProgress: boolean;
	progress: number;
	message: string;
}

export interface IFrontGetters {
	readonly show: boolean;
}

export interface IFrontStore extends IFrontState, IFrontGetters {
}

export const useFrontStore: () => IFrontStore = defineStore('front', {
	state: (): IFrontState => {
		return {
			showProgress: false,
			progress: 0,
			message: '',
		};
	},
	getters: {
		show({showProgress, message}: IFrontState): boolean {
			return Boolean(showProgress || message);
		}
	},
	actions: {}
}) as any;
