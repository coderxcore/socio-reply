import en from './stopwords/en.txt?raw'
import ja from './stopwords/ja.txt?raw'
import ko from './stopwords/ko.txt?raw'
import zh from './stopwords/zh.txt?raw'
import {StorageLocal} from "gs-br-ext";

const StopWordKey = 'stop-words'

export class FileData {

	static #stopWords: Set<string> | null = null;

	static async stopWords() {
		if (this.#stopWords) {
			return this.#stopWords;
		}
		let words = await StorageLocal.getValue(StopWordKey)
		if (!words || !Array.isArray(words)) {
			words = [
				...(en as string).split('\n'),
				...(ja as string).split('\n'),
				...(ko as string).split('\n'),
				...(zh as string).split('\n'),
			];
		}
		return this.#stopWords = new Set(words);
	}
}
