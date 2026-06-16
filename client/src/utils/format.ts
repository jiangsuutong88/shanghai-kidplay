/**
 * 格式化工具函数
 */

/** 格式化费用 */
export function formatCost(cost: number): string {
  if (cost === 0) return '免费'
  return `¥${cost}`
}

/** 格式化评分 */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** 格式化月龄为可读文字 */
export function formatAgeRange(minMonths: number, maxMonths: number): string {
  const formatMonth = (m: number): string => {
    if (m < 12) return `${m}个月`
    const years = Math.floor(m / 12)
    const months = m % 12
    if (months === 0) return `${years}岁`
    return `${years}岁${months}个月`
  }
  return `${formatMonth(minMonths)}-${formatMonth(maxMonths)}`
}

/** 格式化距离 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`
  if (km < 10) return `${km.toFixed(1)}km`
  return `${Math.round(km)}km`
}

/** 格式化驾车时间 */
export function formatDrivingMinutes(minutes: number): string {
  if (minutes < 60) return `约${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `约${hours}小时`
  return `约${hours}小时${mins}分钟`
}

/** 截断文字 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
