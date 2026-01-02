export interface ISite {
	title: string
	postUrlPrefix: string
	replyUrlPrefix: string
}

export interface IScene {
	id?: number
	name: string
	description?: string
	sites: Array<ISite>
}
