import {IStoreSchema} from "gs-idb-pro";
import {IScene} from "../src-type";

export const SceneStoreName = 'scene'


export const sceneSchema: IStoreSchema = {
	name: SceneStoreName,
	defaultData:<IScene[]>[
		{
			id: -2,
			name: 'allScene',
			description: 'allSceneDesc',
			sites: []
		},
		{
			id: -1,
			name: 'defaultScene',
			description: 'defaultSceneDesc',
			sites: []
		},
		{
			id: 1,
			name: 'aiScene',
			description: 'aiSceneDesc',
			sites: [
				{
					title: 'chatgpt',
					postUrlPrefix: 'chatgpt.com',
					replyUrlPrefix: 'chatgpt.com/c'
				},
			]
		},
		{
			id: 2,
			name: 'socioScene',
			description: 'socioSceneDesc',
			sites: []
		},
		{
			id: 3,
			name: 'videoScene',
			description: 'videoSceneDesc',
			sites: []
		},
	]
}
