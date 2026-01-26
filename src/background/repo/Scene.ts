import {builtInSceneIds, IScene} from "/src-com";
import {Db} from "../db";

export class Scene {

	static #scenes?: IScene[]
	static #siteSceneMap?: Map<string, IScene>
	static #unspecifiedScene?: IScene

	static async query(): Promise<IScene[]> {
		if (this.#scenes) {
			return this.#scenes;
		}
		const scenes = await Db.scene.all();
		const index = scenes.findIndex(s => s.id === builtInSceneIds.unspecifiedScene);
		if (index >= 0) {
			this.#unspecifiedScene = scenes[index];
		}
		return this.#scenes = scenes;
	}

	static cleanCache() {
		this.#scenes = undefined;
	}

	static getSceneByUrl(url: string): IScene | undefined {
		const map = this.#getSiteMap();
		const prefix = Array.from(map.keys()).find(p => url.includes(p));
		if (prefix && map.has(prefix)) {
			return map.get(prefix);
		}
		return this.#unspecifiedScene;
	}

	static #getSiteMap(): Map<string, IScene> {
		if (this.#siteSceneMap) {
			return this.#siteSceneMap;
		}
		const map = new Map<string, IScene>();
		for (const scene of this.#scenes || []) {
			for (const site of scene.sites || []) {
				map.set(site.urlPrefix, scene);
			}
		}
		return this.#siteSceneMap = map;
	}

}
