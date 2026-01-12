import {detect} from 'jschardet'

const SAMPLE_SIZE = 1024 // 32KB

export async function detectEncoding(file: Blob, fallback = 'gbk'): Promise<string> {
	// 1️⃣ 只读文件头
	const buffer = await file.slice(0, SAMPLE_SIZE).arrayBuffer()
	const bytes = new Uint8Array(buffer)

	// 2️⃣ BOM
	if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return 'utf-8'
	if (bytes[0] === 0xff && bytes[1] === 0xfe) return 'utf-16le'
	if (bytes[0] === 0xfe && bytes[1] === 0xff) return 'utf-16be'

	// 3️⃣ UTF-8 合法性
	try {
		new TextDecoder('utf-8', {fatal: true}).decode(bytes)
		return 'utf-8'
	} catch {
	}

	// 4️⃣ jschardet（binary string）
	let binary = ''
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i])
	}

	const {encoding, confidence} = detect(binary)

	if (encoding && confidence > 0.6) {
		return encoding.toLowerCase()
	}

	return fallback
}
