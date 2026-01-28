import {IScene, ISearchTerm} from "/src-com";
import {IInputItem} from "./IInputItem";
import {IPoint} from "./IPoint";

export interface IPageContextState {
	scene: IScene
	inputItem?: IInputItem
	terms: ISearchTerm[]
	inputPoint?: IPoint
	tabStatus?: 1 | 2
	tabTime?: number
}

export interface IPageContextGetters {
	el?: HTMLElement
	lineHeight: number
}

export interface IPageContextActions {

	queryTerm(search: string, start: number, end: number): Promise<void>;

	changeText(text: string): Promise<void>

	fullTerm(term: ISearchTerm): Promise<void>
}

export interface IPageContextStore extends IPageContextState, IPageContextGetters, IPageContextActions {
}
