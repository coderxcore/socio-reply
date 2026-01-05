import {IStoreSchema} from "gs-idb-pro";
import {IScene} from "/src-com";

export const SceneStoreName = 'scene'


export const sceneSchema: IStoreSchema = {
	name: SceneStoreName,
	indexSchemas: [
		{
			name: SceneStoreName,
			unique: true
		}
	],
	defaultData: <IScene[]>[
		{
			id: -1,
			name: 'genericScene',
			description: 'genericSceneDesc',
			isBuiltIn: true,
			sites: []
		},
		{
			id: 1,
			name: 'aiScene',
			description: 'aiSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'chatgpt',
					urlPrefix: 'chatgpt.com',
				},
				{
					title: 'google bard',
					urlPrefix: 'bard.google.com',
				},
				{
					title: 'claude',
					urlPrefix: 'claude.ai',
				},
				{
					title: '文心一言',
					urlPrefix: 'yiyan.baidu.com',
				},
				{
					title: '通义千问',
					urlPrefix: 'tongyi.aliyun.com',
				}
			]
		},
		{
			id: 2,
			name: 'socioScene',
			description: 'socioSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'facebook',
					urlPrefix: 'facebook.com',
				},
				{
					title: 'x',
					urlPrefix: 'x.com',
				},
				{
					title: 'instagram',
					urlPrefix: 'instagram.com',
				},
				{
					title: 'linkedin',
					urlPrefix: 'linkedin.com',
				},
				{
					title: 'wechat',
					urlPrefix: 'wechat.com',
				},
				{
					title: 'weibo',
					urlPrefix: 'weibo.com',
				}
			]
		},
		{
			id: 3,
			name: 'videoScene',
			description: 'videoSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'youtube',
					urlPrefix: 'youtube.com',
				},
				{
					title: 'netflix',
					urlPrefix: 'netflix.com',
				},
				{
					title: 'twitch',
					urlPrefix: 'twitch.tv',
				},
				{
					title: 'bilibili',
					urlPrefix: 'bilibili.com',
				},
				{
					title: 'douyin',
					urlPrefix: 'douyin.com',
				}
			]
		},
	]
}
