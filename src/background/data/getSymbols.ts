import face from './symbol/face.txt?raw'
import hand from './symbol/hand.txt?raw'
import food from './symbol/food.txt?raw'
import sport from './symbol/sport.txt?raw'
import transport from './symbol/transport.txt?raw'
import device from './symbol/device.txt?raw'
import flag from './symbol/flag.txt?raw'
import math from './symbol/math.txt?raw'
import special from './symbol/special.txt?raw'

const emojiCategories = {
  face,
  hand,
  food,
  sport,
  transport,
  device,
  flag,
} as const

const symbolCategories = {
  ...emojiCategories,
  math,
  special,
} as const

function parseEmojiLine(line: string): [string, string[]] {
  const parts = line.trim().split(/\s+/)
  if (parts.length === 0) {
    throw new Error('Empty line found in emoji file')
  }
  const emoji = parts[0]
  const descriptions = parts.slice(1)
  return [emoji, descriptions]
}

export function getSymbols(): [string, string[]][] {
  const allEmojis: [string, string[]][] = []

  for (const content of Object.values(symbolCategories)) {
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
