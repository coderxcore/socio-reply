import {IDocument, IDocumentBase} from "gs-search/type";
import {Bool} from "gs-idb-basic";

export interface IMessage extends IDocumentBase {
	id?: number
	hash?: number
	text: string
	sceneIds: number[],
	kind?: 'reference' | 'content'
	stage?: 'history' | 'draft'
	scope?: 'body' | 'reply'
	url?: string
	added_at?: number
	updated_at?: number
	keywords?: string[]
	keywords_only?: boolean
	deleted?: Bool
	tokens?: string[]
}

export interface ISearchReply extends IMessage, IDocument {
	text: string
	sceneIds: number[]
	tokens: string[]
}
