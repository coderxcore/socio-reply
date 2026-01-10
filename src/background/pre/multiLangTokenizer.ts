import { ITerm } from "/src-com"
import { hash } from "gs-search/core"

export interface TokenizeOptions {
	maxPrefix?: number
	fuzzyCharMode?: "none" | "cjk" | "all"
	fuzzyKeepMultiWhenChar?: boolean
	filterSingleChar?: boolean
}

const DEFAULT_OPTIONS: Required<TokenizeOptions> = {
	maxPrefix: 1,
	fuzzyCharMode: "none",
	fuzzyKeepMultiWhenChar: true,
	filterSingleChar: true,
}

/* ======================= Regex ======================= */

const RE_SPLITTER = /[\/._·\-]+/
const RE_SENTENCE = /[。！？!?]+/
const RE_WORD = /[\p{Script=Han}]+|[a-zA-Z]+|\d+(\.\d+)+|\d+/gu
const RE_MIXED = /[a-zA-Z]+|\d+/g
const RE_GIBBERISH = /^[a-f0-9]{16,}$|^[a-zA-Z0-9]{24,}$/i
const RE_CJK = /[\u4e00-\u9fff]/

/* ======================= Utils ======================= */

function safeDecode(s: string) {
	try { return decodeURIComponent(s) } catch { return s }
}

function isStructured(text: string) {
	return RE_SPLITTER.test(text)
}

function isGibberish(w: string) {
	return RE_GIBBERISH.test(w)
}

function isCJKWord(w: string) {
	return [...w].every(ch => RE_CJK.test(ch))
}

function buildPrefix(word: string, maxPrefix: number): string[] {
	const res: string[] = []
	const limit = Math.min(word.length - 1, maxPrefix)
	for (let i = 1; i <= limit; i++) res.push(word.slice(0, i))
	return res
}

function buildFuzzy(
	word: string,
	options: Required<TokenizeOptions>
): string[] {
	const res = new Set<string>()
	const isCJK = isCJKWord(word)
	if (word.length >= 2 && !isGibberish(word)) {
		for (let i = 0; i < word.length - 1; i++) {
			res.add(word.slice(i, i + 2))
		}
	}
	if (
		options.fuzzyCharMode === "all" ||
		(options.fuzzyCharMode === "cjk" && isCJK)
	) {
		for (const ch of word) res.add(ch)
	}
	if (!options.fuzzyKeepMultiWhenChar) {
		for (const v of [...res]) {
			if (v.length > 1) res.delete(v)
		}
	}

	return [...res]
}

function splitStructuredWords(
	text: string,
	filterSingleChar: boolean
): string[] {
	const out: string[] = []

	for (const seg of text.split(RE_SPLITTER)) {
		if (!seg) continue
		const words = seg.match(RE_WORD) ?? []

		for (const w of words) {
			const subs = w.match(RE_MIXED)
			const parts = subs && subs.length > 1 ? subs : [w]

			for (const p of parts) {
				if (filterSingleChar && p.length === 1) continue
				if (!isGibberish(p)) out.push(p)
			}
		}
	}

	return [...new Set(out)]
}

function splitChineseSentence(text: string): string[] {
	return text
		.split(RE_SENTENCE)
		.map(s => s.trim())
		.filter(s => s.length > 1)
}

export function tokenizeMultiLang(
	input: string,
	opts?: TokenizeOptions
): ITerm[] {
	const options:TokenizeOptions = { ...DEFAULT_OPTIONS, ...opts }
	const results: ITerm[] = []
	const visited = new Set<string>()

	function emit(
		word: string,
		fuzzyFromParent: string[] = [],
		disablePrefix = false
	) {
		if (visited.has(word)) return
		visited.add(word)

		const prefix = disablePrefix ? [] : buildPrefix(word, options.maxPrefix)
		const fuzzy = new Set<string>()

		buildFuzzy(word, options as any).forEach(v => fuzzy.add(v))
		fuzzyFromParent.forEach(v => fuzzy.add(v))

		prefix.forEach(p => fuzzy.delete(p))
		fuzzy.delete(word)

		results.push({
			text: word,
			hash: hash(word),
			prefix,
			fuzzy: [...fuzzy],
		})
	}

	function process(text: string) {
		if (!text || visited.has(text)) return
		const decoded = safeDecode(text)

		if (isStructured(decoded)) {
			const words = splitStructuredWords(decoded, options.filterSingleChar)
			emit(text, words, true)
			words.forEach(w => process(w))
			return
		}

		if (RE_SENTENCE.test(decoded)) {
			const parts = splitChineseSentence(decoded)
			emit(text, parts, true)
			parts.forEach(p => process(p))
			return
		}

		emit(text)
	}

	input.split(/\s+/).filter(Boolean).forEach(process)
	return results
}
