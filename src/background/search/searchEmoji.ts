import {ISearchTerm} from "../../../src-com";
import {FileData} from "../data";

let lastCharMap: Map<number, string[]> | undefined;
let descEmojiMap: Map<string, string[]> | undefined;

export function searchEmoji(query: string): ISearchTerm[] {
	if (!query || !query.length) {
		return [];
	}
	checkAndInitMap();
}

function checkAndInitMap() {
	if (lastCharMap) {
		return;
	}
	lastCharMap = new Map();
	descEmojiMap = new Map();
	const dict = FileData.emojisDict()
	for (let i = 0; i < dict.length; i++) {
		const [emoji, descriptions] = dict[i];
		for(let j = 0; j < descriptions.length; j++) {
			const desc = descriptions[j];

			const emojiArr = descEmojiMap.get(desc)||[];
			emojiArr.push(emoji);
			descEmojiMap.set(desc, emojiArr);

			const lastChar = desc.charCodeAt(desc.length - 1);
			const discArr = lastCharMap.get(lastChar)||[];
			discArr.push(desc);
			lastCharMap.set(lastChar, discArr);
		}
	}
}

checkAndInitMap();
console.log(descEmojiMap)
console.log(lastCharMap)
