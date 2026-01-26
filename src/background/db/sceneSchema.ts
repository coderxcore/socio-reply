import {IStoreSchema} from "gs-idb-pro";
import {builtInSceneIds, IScene} from "/src-com";

export const SceneStoreName = 'scene'


export const sceneSchema: IStoreSchema = {
	name: SceneStoreName,
	indexSchemas: [
		{
			name: 'name',
			unique: true
		}
	],
	defaultData: <IScene[]>[
		{
			id: builtInSceneIds.unspecifiedScene,
			name: 'unspecifiedScene',
			description: 'unspecifiedSceneDesc',
			isBuiltIn: true,
			sites: []
		},
		{
			id: builtInSceneIds.aiScene,
			name: 'aiScene',
			description: 'aiSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'chatgpt',
					urlPart: 'chatgpt.com',
				},
				{
					title: 'google bard',
					urlPart: 'bard.google.com',
				},
				{
					title: 'gemini',
					urlPart: 'gemini.google.com',
				},
				{
					title: 'claude',
					urlPart: 'claude.ai',
				},
				{
					title: 'yiyan',
					urlPart: 'yiyan.baidu.com',
				},
				{
					title: 'tongyi',
					urlPart: 'tongyi.aliyun.com',
				},
				{
					title: 'doubao',
					urlPart: 'doubao.com/chat',
				},
			]
		},
		{
			id: builtInSceneIds.socioScene,
			name: 'socioScene',
			description: 'socioSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'facebook',
					urlPart: 'facebook.com',
				},
				{
					title: 'x',
					urlPart: 'x.com',
				},
				{
					title: 'instagram',
					urlPart: 'instagram.com',
				},
				{
					title: 'linkedin',
					urlPart: 'linkedin.com',
				},
				{
					title: 'wechat',
					urlPart: 'wechat.com',
				},
				{
					title: 'weibo',
					urlPart: 'weibo.com',
				}
			]
		},
		{
			id: builtInSceneIds.videoScene,
			name: 'videoScene',
			description: 'videoSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'youtube',
					urlPart: 'youtube.com',
				},
				{
					title: 'netflix',
					urlPart: 'netflix.com',
				},
				{
					title: 'twitch',
					urlPart: 'twitch.tv',
				},
				{
					title: 'bilibili',
					urlPart: 'bilibili.com',
				},
				{
					title: 'douyin',
					urlPart: 'douyin.com',
				}
			]
		},
		{
			id: builtInSceneIds.ecommerceScene,
			name: 'ecommerceScene',
			description: 'ecommerceSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'taobao',
					urlPart: 'taobao.com',
				},
				{
					title: 'jd',
					urlPart: 'jd.com',
				},
				{
					title: 'amazon',
					urlPart: 'amazon.com',
				},
				{
					title: 'ebay',
					urlPart: 'ebay.com',
				},
				{
					title: 'aliExpress',
					urlPart: 'aliexpress.com',
				},
				{
					title: 'tmall',
					urlPart: 'tmall.com',
				},
				{
					title: 'pinduoduo',
					urlPart: 'pinduoduo.com',
				},
				{
					title: 'walmart',
					urlPart: 'walmart.com',
				},
				{
					title: 'bestbuy',
					urlPart: 'bestbuy.com',
				},
				{
					title: 'target',
					urlPart: 'target.com',
				}
			]
		}
	]
}
