import {defineStore} from "pinia";
import {Api} from "../api";
import {copyObject} from "gs-base";

export interface IEmojiState {
	emojiCategories: Record<string, string[]>;
	recentEmojis: string[];
}

export interface IEmojiGetters {

}

export interface IEmojiActions {
	loadEmojiCategories(): Promise<void>;
	addRecentEmoji(emoji: string): void
}

export interface IEmojiStore extends IEmojiState, IEmojiGetters, IEmojiActions {
}

export const useEmojiStore: () => IEmojiStore = defineStore('emoji-store', {
	state: (): IEmojiState => {
		return {
			emojiCategories: {},
			recentEmojis: [],
		};
	},
	getters: {},
	actions: <IEmojiActions>{
		async loadEmojiCategories() {
			if(Object.keys(this.emojiCategories).length) return;
			this.emojiCategories = await Api.data.getEmojiCategories();
			console.log(copyObject(this.emojiCategories))
		},
		addRecentEmoji(emoji: string) {
			this.recentEmojis = this.recentEmojis.filter(e => e !== emoji);
			this.recentEmojis.unshift(emoji);
			if (this.recentEmojis.length > 5) this.recentEmojis.pop();
		}
	}
}) as any;
