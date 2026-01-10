import {IDocument} from "gs-search/type";

export interface ITerm extends IDocument {
	id?: number
	hash: number
	text: string
	prefix: string[]
	fuzzy: string[]
}
