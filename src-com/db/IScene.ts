export const BuiltInSceneKeys = ['aiScene', 'ecommerceScene', 'genericScene', 'videoScene', 'socioScene'] as const;

export type BuiltInSceneKey = typeof BuiltInSceneKeys[number];

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

export const builtInSceneIds: Record<BuiltInSceneKey, number> = Object.freeze({
	genericScene: -1,
	aiScene: 1,
	socioScene: 2,
	videoScene: 3,
	ecommerceScene: 4,
})
