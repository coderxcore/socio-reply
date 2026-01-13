import face from './emoji/face.txt?raw'
import hand from './emoji/hand.txt?raw'
import food from './emoji/food.txt?raw'
import sport from './emoji/sport.txt?raw'
import transport from './emoji/transport.txt?raw'
import device from './emoji/device.txt?raw'

// 定义 emoji 分类映射
const emojiCategories = {
  face,
  hand,
  food,
  sport,
  transport,
  device
} as const

// 解析单行 emoji 数据
function parseEmojiLine(line: string): [string, string[]] {
  const parts = line.trim().split(/\s+/)
  if (parts.length === 0) {
    throw new Error('Empty line found in emoji file')
  }
  const emoji = parts[0]
  const descriptions = parts.slice(1)
  return [emoji, descriptions]
}

/**
 * 获取所有的emoji
 * @returns [emoji, 描述[]]
 */
export function getEmoji(): [string, string[]][] {
  const allEmojis: [string, string[]][] = []

  for (const content of Object.values(emojiCategories)) {
    const lines = (content as string).split(/\s*\n\s*/).filter(Boolean)
    for (const line of lines) {
      allEmojis.push(parseEmojiLine(line))
    }
  }

  return allEmojis
}

/**
 * 获取所有的emoji分类
 * @returns {Record<string, string[]>} 分类 -> emoji[]
 */
export function getEmojiCategories(): Record<string, string[]> {
  const categories: Record<string, string[]> = {}

  for (const [category, content] of Object.entries(emojiCategories)) {
    const lines = (content as string).split(/\s*\n\s*/).filter(Boolean)
    categories[category] = lines.map(line => parseEmojiLine(line)[0])
  }

  return categories
}
