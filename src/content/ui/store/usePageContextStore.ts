import {defineStore} from "pinia";
import {builtInSceneIds, IScene, ISearchTerm} from "/src-com";
import {IPageContextActions, IPageContextState, IPageContextStore} from "../../type";
import {queryTerm} from "/src-page/lib/queryTerm";
import {getCaretPoint} from "../../lib/getCaretPoint";
import {getSafeLineHeight} from "../../lib/getSafeLineHeight";
import {writeInput} from "../../lib/writeInput";
import {getTermText} from "/src-com/lib/getTermText";


export const usePageContextStore: () => IPageContextStore = defineStore('page-context-store', {
	state: (): IPageContextState => {
		return {
			scene: {id: builtInSceneIds.unspecifiedScene} as IScene,
			inputItem: undefined,
			terms: [],
			inputPoint: undefined,
			tabStatus: undefined,
			tabTime: undefined
		};
	},
	getters: {
		el(state): HTMLElement | undefined {
			return state.inputItem?.el;
		},
		lineHeight({el}: IPageContextStore): number {
			if (!el) return 12;
			return getSafeLineHeight(el);
		},
	},
	actions: <IPageContextActions>{
		async queryTerm(search: string, start: number, end: number): Promise<void> {
			if (!search) {
				this.terms = [];
				return;
			}
			this.inputPoint = getCaretPoint(this.el!);
			this.terms = await queryTerm(search, this.inputItem.text, start, end);
		},
		async changeText(text: string): Promise<void> {
			await writeInput(this.el, text);
			setTimeout(()=>this.queryTerm(text,text.length,text.length),10)
		},
		async fullTerm(term: ISearchTerm):Promise<void> {
			const text = this.inputItem.text = getTermText(this.inputItem.text,term);
			this.terms.length = 0;
			await this.changeText(text);
		}
	}
}) as any;
