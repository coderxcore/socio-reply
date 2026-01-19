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
}

export interface ISceneStore extends ISceneState, ISceneGetters {
	findScenes(url: string): IScene[]

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
			return scenes.filter(scene => scene.id !== builtInSceneIds.unresolvedScene);
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
		}
	},
	actions: {
		findScenes(url: string): IScene[] {
			const {urlPrefixes, urlSceneMap} = this as ISceneGetters;
			url = url.replace(/^https?:\/\//, '');
			const scenes: IScene[] = [];
			for (const prefix of urlPrefixes) {
				if (url.startsWith(prefix)) {
					const scene = urlSceneMap.get(prefix);
					if (scene) {
						scenes.push(scene);
					}
				}
			}
			return scenes;
		},
		async loadScenes(): Promise<void> {
			this.scenes = await Api.scene.queryScenes();
		}
	}
}) as any;
