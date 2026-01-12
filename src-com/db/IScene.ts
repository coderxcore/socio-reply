export const BuiltInSceneKeys = ['aiScene', 'ecommerceScene', 'genericScene', 'videoScene', 'socioScene'];


export interface ISite {
	title: string
	urlPrefix: string
}

export interface IScene {
	id?: number
	name: string
	description?: string
	isBuiltIn?: boolean
	sites: Array<ISite>
}
