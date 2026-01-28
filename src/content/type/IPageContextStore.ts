import {IScene, ISearchTerm} from "/src-com";
import {IInputItem} from "./IInputItem";
import {IPoint} from "./IPoint";

export interface IPageContextState {
	scene: IScene
	inputItem?: IInputItem
	terms: ISearchTerm[]
	inputPoint?: IPoint
}

export interface IPageContextGetters {
	el?: HTMLElement
	lineHeight: number
}

export interface IPageContextActions {
	queryTerm(search: string, start: number, end: number): Promise<void>;
}

export interface IPageContextStore extends IPageContextState, IPageContextGetters, IPageContextActions {
}
