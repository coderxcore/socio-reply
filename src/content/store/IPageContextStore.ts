import {defineStore} from "pinia";
import {builtInSceneIds, IScene, ISearchTerm} from "/src-com";
import {IInputItem} from "../type";

export interface IPageContextState {
	scene: IScene
	inputItem?: IInputItem
	terms: ISearchTerm[]
}

export interface IPageContextGetters {
	inputEl?: HTMLElement
}

export interface IPageContextActions {
	queryTerm(search: string, start: number, end: number): Promise<void>;
}

export interface IPageContextStore extends IPageContextState, IPageContextGetters, IPageContextActions {
}

export const usePageContextStore: () => IPageContextStore = defineStore('page-context-store', {
	state: (): IPageContextState => {
		return {
			scene: {id: builtInSceneIds.unspecifiedScene} as IScene,
			inputItem: undefined,
			terms: []
		};
	},
	getters: {
		inputEl(state): HTMLElement | undefined {
			return state.inputItem?.el;
		},
	},
	actions: <IPageContextActions>{
		async queryTerm(search: string, start: number, end: number): Promise<void> {
			// this.terms = await queryTerm(search, start, end);
		}

	}
}) as any;
