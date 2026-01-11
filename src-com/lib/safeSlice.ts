let seg: any;

function getSeg(): Intl.Segmenter {
	return seg || (seg = new Intl.Segmenter("zh", {granularity: "grapheme"}));
}

export function safeSlice(text: string, start: number, end?: number) {
	const seg = getSeg();
	return [...seg.segment(text)].slice(start, end).map(s=>s.segment).join('');
}
