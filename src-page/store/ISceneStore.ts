import {defineStore} from "pinia";
import {builtInSceneIds, IScene} from "/src-com";
import {Api} from "../api";

export interface ISceneState {
	scenes: IScene[]
}

export interface ISceneGetters {
	readonly usableScenes: IScene[]
	readonly names: string[]
	readonly idSceneMap: Map<number, IScene>
	readonly urlSceneMap: Map<string, IScene>
	readonly urlPrefixes: string[]
	readonly defaultScene: IScene
}

export interface ISceneStore extends ISceneState, ISceneGetters {
	findScenes(url: string): IScene

	loadScenes(): Promise<void>
}

export const useSceneStore: () => ISceneStore = defineStore('scene', {
	state: (): ISceneState => {
		return {
			scenes: []
		};
	},
	getters: {
		usableScenes({scenes}): IScene[] {
			return scenes;
		},
		names({scenes}): string[] {
			return scenes.map(scene => scene.name);
		},
		urlSceneMap({scenes}): Map<string, IScene> {
			return new Map(scenes.flatMap(scene => scene.sites.map(site => [site.urlPrefix, scene])));
		},
		urlPrefixes({scenes}): string[] {
			return scenes
				.flatMap(scene => scene.sites.map(site => site.urlPrefix))
				.sort((a, b) => b.length - a.length);
		},
		idSceneMap({scenes}): Map<number, IScene> {
			return new Map(scenes.map(scene => [scene.id!, scene]));
		},
		defaultScene({idSceneMap}:ISceneGetters): IScene {
			return idSceneMap.get(builtInSceneIds.unspecifiedScene);
		},
	},
	actions: {
		findScenes(url: string): IScene {
			const {urlPrefixes, urlSceneMap} = this as ISceneGetters;
			url = url.replace(/^https?:\/\//, '');
			for(let i=0; i<2; i++) {
				for (const prefix of urlPrefixes) {
					if (url.startsWith(prefix)) {
						const scene = urlSceneMap.get(prefix);
						if (scene) {
							return scene;
						}
					}
				}
				url = url.replace(/^[^.]+\.((?:[^.]+\.)+[^.]+)/, '$1');
				console.log(url)
			}
			return this.defaultScene;
		},
		async loadScenes(): Promise<void> {
			this.scenes = await Api.scene.queryScenes();
		}
	}
}) as any;
