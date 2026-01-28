import {defineStore} from "pinia";
import {builtInSceneIds, IScene} from "/src-com";
import {IPageContextActions, IPageContextState, IPageContextStore} from "../../type";
import {queryTerm} from "/src-page/lib/queryTerm";
import {getCaretPoint} from "../../lib/getCaretPoint";


export const usePageContextStore: () => IPageContextStore = defineStore('page-context-store', {
	state: (): IPageContextState => {
		return {
			scene: {id: builtInSceneIds.unspecifiedScene} as IScene,
			inputItem: undefined,
			terms: [],
			inputPoint: undefined
		};
	},
	getters: {
		el(state): HTMLElement | undefined {
			return state.inputItem?.el;
		},
		lineHeight({el}:IPageContextStore): number {
			if(!el) return 12;
			return Number(getComputedStyle(el).lineHeight.replace('px', ''));
		},
	},
	actions: <IPageContextActions>{
		async queryTerm(search: string, start: number, end: number): Promise<void> {
			if(!search) {
				this.terms = [];
				return;
			}
			this.inputPoint = getCaretPoint(this.el!);
			this.terms = await queryTerm(search, this.inputItem.text, start, end);
		}
	}
}) as any;
