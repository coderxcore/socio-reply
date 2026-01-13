import {IDocument} from "gs-search/type";
import {IResult} from "gs-search";

export interface ITerm extends IDocument {
	id?: number
	hash: number
	text: string
	prefix: string[]
	fuzzy: string[]
}

export interface ISearchTerm extends Partial<IResult> {
	text: string
	isEmoji: boolean
}
