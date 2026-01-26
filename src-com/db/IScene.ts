export const BuiltInSceneKeys = ['unspecifiedScene', 'aiScene', 'socioScene', 'videoScene', 'ecommerceScene'] as const;

export type BuiltInSceneKey = typeof BuiltInSceneKeys[number];

export interface ISite {
	title: string
	urlPart: string
}

export interface IScene {
	id?: number
	name: string
	description?: string
	isBuiltIn?: boolean
	sites: Array<ISite>
}

export const builtInSceneIds: Record<BuiltInSceneKey, number> = Object.freeze({
	unspecifiedScene: -1,
	aiScene: 1,
	socioScene: 2,
	videoScene: 3,
	ecommerceScene: 4
})
