import {IDocument, IResult} from "gs-search/type";

export interface ITerm extends IDocument {
	id?: number
	hash: number
	text: string
	prefix: string[]
	fuzzy: string[]
}

export interface ISearchTerm extends Partial<IResult> {
	text: string
	termType: 'prefix' | 'fuzzy' | 'emoji'
}
