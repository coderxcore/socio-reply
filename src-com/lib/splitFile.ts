import './detectEncoding'
import {detectEncoding} from "./detectEncoding";

export interface ISplitOption {
	delimiter?: RegExp
	onProgress?: (loaded: number, total: number) => void | Promise<void>
}

export async function* splitFile(file: File, options?: ISplitOption): AsyncGenerator<string> {
	const {
		delimiter = /\s*\n+\s*/g,
		onProgress
	} = options

	if (!delimiter.global) {
		throw new Error('delimiter 必须包含 g')
	}

	const encoding = await detectEncoding(file)

	const reader = file.stream().getReader()
	const decoder = new TextDecoder(encoding)

	const total = file.size
	let loaded = 0
	let carry = ''

	try {
		for (; ;) {
			const {value, done} = await reader.read()
			if (done) break

			loaded += value.byteLength
			try{
				await onProgress?.(loaded, total)
			} catch (e:any) {
			}

			carry += decoder.decode(value, {stream: true})

			delimiter.lastIndex = 0
			let lastEnd = 0
			let match: RegExpExecArray | null

			while ((match = delimiter.exec(carry))) {
				yield carry.slice(lastEnd, match.index)
				lastEnd = delimiter.lastIndex
			}

			carry = carry.slice(lastEnd)
		}
		if (carry) yield carry
	} finally {
		try {
			await reader.cancel()
		} finally {
			reader.releaseLock()
		}
	}
}
