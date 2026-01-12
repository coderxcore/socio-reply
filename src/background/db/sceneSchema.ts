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
			id: builtInSceneIds.genericScene,
			name: 'genericScene',
			description: 'genericSceneDesc',
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
					urlPrefix: 'chatgpt.com',
				},
				{
					title: 'google bard',
					urlPrefix: 'bard.google.com',
				},
				{
					title: 'gemini',
					urlPrefix: 'gemini.google.com',
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
			id: builtInSceneIds.socioScene,
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
			id: builtInSceneIds.videoScene,
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
		{
			id: builtInSceneIds.ecommerceScene,
			name: 'ecommerceScene',
			description: 'ecommerceSceneDesc',
			isBuiltIn: true,
			sites: [
				{
					title: 'taobao',
					urlPrefix: 'taobao.com',
				},
				{
					title: 'jd',
					urlPrefix: 'jd.com',
				},
				{
					title: 'amazon',
					urlPrefix: 'amazon.com',
				},
				{
					title: 'ebay',
					urlPrefix: 'ebay.com',
				},
				{
					title: 'aliExpress',
					urlPrefix: 'aliexpress.com',
				},
				{
					title: 'tmall',
					urlPrefix: 'tmall.com',
				},
				{
					title: 'pinduoduo',
					urlPrefix: 'pinduoduo.com',
				},
				{
					title: 'walmart',
					urlPrefix: 'walmart.com',
				},
				{
					title: 'bestbuy',
					urlPrefix: 'bestbuy.com',
				},
				{
					title: 'target',
					urlPrefix: 'target.com',
				}
			]
		},
	]
}
