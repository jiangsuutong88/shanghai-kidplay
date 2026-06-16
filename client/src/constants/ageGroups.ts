import type { AgeGroup } from '../types'

/** 年龄段配置 */
export const AGE_GROUPS: AgeGroup[] = [
  {
    label: '0-1岁',
    minMonths: 0,
    maxMonths: 12,
    emoji: '👶',
  },
  {
    label: '1-3岁',
    minMonths: 12,
    maxMonths: 36,
    emoji: '🧒',
  },
  {
    label: '3-6岁',
    minMonths: 36,
    maxMonths: 72,
    emoji: '👦',
  },
]

/** 根据月龄获取年龄段 */
export function getAgeGroupByMonths(months: number): AgeGroup | undefined {
  return AGE_GROUPS.find((g) => months >= g.minMonths && months <= g.maxMonths)
}

/** 获取年龄段标签 */
export function getAgeLabel(venue: { minAgeMonths: number; maxAgeMonths: number }): string {
  const minYear = Math.floor(venue.minAgeMonths / 12)
  const minMonth = venue.minAgeMonths % 12
  const maxYear = Math.floor(venue.maxAgeMonths / 12)
  const maxMonth = venue.maxAgeMonths % 12

  const formatAge = (y: number, m: number): string => {
    if (y === 0) return `${m}个月`
    if (m === 0) return `${y}岁`
    return `${y}岁${m}个月`
  }

  return `${formatAge(minYear, minMonth)} - ${formatAge(maxYear, maxMonth)}`
}
