import {defineStore} from "pinia";
import {builtInSceneIds, IScene} from "/src-com";
import {Api} from "../api";

export interface ISceneState {
	scenes: IScene[]
}

export interface ISceneGetters {
	readonly names: string[]
	readonly idSceneMap: Map<number, IScene>
	readonly urlSceneMap: Map<string, IScene>
	readonly urlParts: string[]
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
		names({scenes}): string[] {
			return scenes.map(scene => scene.name);
		},
		urlSceneMap({scenes}): Map<string, IScene> {
			return new Map(scenes.flatMap(scene => scene.sites.map(site => [site.urlPart, scene])));
		},
		urlParts({scenes}): string[] {
			return scenes
				.flatMap(scene => scene.sites.map(site => site.urlPart))
				.sort((a, b) => b.length - a.length);
		},
		idSceneMap({scenes}): Map<number, IScene> {
			return new Map(scenes.map(scene => [scene.id!, scene]));
		},
		defaultScene({idSceneMap}: ISceneGetters): IScene {
			return idSceneMap.get(builtInSceneIds.unspecifiedScene);
		},
	},
	actions: {
		findScenes(url: string): IScene {
			const {urlParts, urlSceneMap} = this as ISceneGetters;
			for (const prefix of urlParts) {
				if (url.includes(prefix)) {
					const scene = urlSceneMap.get(prefix);
					if (scene) {
						return scene;
					}
				}
			}
			return this.defaultScene;
		},
		async loadScenes(): Promise<void> {
			this.scenes = await Api.scene.queryScenes();
		}
	}
}) as any;
