import type { WeatherType } from '../types'

/** 天气类型配置 */
export const WEATHER_CONFIG: Record<WeatherType, { label: string; emoji: string; color: string }> = {
  sunny: { label: '晴天', emoji: '☀️', color: '#FBBF24' },
  cloudy: { label: '多云', emoji: '⛅', color: '#9CA3AF' },
  rainy: { label: '阴雨天', emoji: '🌧️', color: '#60A5FA' },
  hot: { label: '高温', emoji: '🌡️', color: '#EF4444' },
  cold: { label: '寒冷', emoji: '❄️', color: '#93C5FD' },
}

/** 天气选择项（用户可手动选择的） */
export const WEATHER_OPTIONS: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'hot', 'cold']

/** 月份推荐映射 */
export const MONTH_RECOMMEND: Record<number, { title: string; subtitle: string; emoji: string; venueTypes: string[] }> = {
  1: {
    title: '1月冬日遛娃',
    subtitle: '寒冷天气，室内暖和首选',
    emoji: '❄️',
    venueTypes: ['museum', 'indoor_park', 'science_center', 'aquarium'],
  },
  2: {
    title: '2月春节遛娃',
    subtitle: '年味浓浓，室内活动为主',
    emoji: '🧧',
    venueTypes: ['museum', 'indoor_park', 'library'],
  },
  3: {
    title: '3月春暖花开',
    subtitle: '气温回暖，户外赏花好时节',
    emoji: '🌸',
    venueTypes: ['park', 'farm', 'zoo'],
  },
  4: {
    title: '4月踏青季',
    subtitle: '春游正当时，户外活动首选',
    emoji: '🌿',
    venueTypes: ['park', 'farm', 'zoo', 'playground'],
  },
  5: {
    title: '5月初夏遛娃',
    subtitle: '天气舒适，户外户内皆宜',
    emoji: '🌺',
    venueTypes: ['park', 'zoo', 'museum', 'farm'],
  },
  6: {
    title: '6月梅雨季遛娃',
    subtitle: '梅雨来临，室内避雨为主',
    emoji: '🌧️',
    venueTypes: ['museum', 'indoor_park', 'aquarium', 'library'],
  },
  7: {
    title: '7月酷暑遛娃',
    subtitle: '高温来袭，室内空调必备',
    emoji: '🌞',
    venueTypes: ['indoor_park', 'museum', 'aquarium', 'swimming'],
  },
  8: {
    title: '8月盛夏遛娃',
    subtitle: '三伏天，玩水避暑首选',
    emoji: '🏊',
    venueTypes: ['swimming', 'indoor_park', 'aquarium', 'science_center'],
  },
  9: {
    title: '9月金秋遛娃',
    subtitle: '暑气渐消，户外活动好时机',
    emoji: '🍂',
    venueTypes: ['park', 'farm', 'zoo', 'playground'],
  },
  10: {
    title: '10月秋高气爽',
    subtitle: '最佳户外季，秋游好时光',
    emoji: '🍁',
    venueTypes: ['park', 'farm', 'zoo', 'playground'],
  },
  11: {
    title: '11月深秋遛娃',
    subtitle: '秋景尾声，抓紧户外好时光',
    emoji: '🍃',
    venueTypes: ['park', 'museum', 'science_center', 'zoo'],
  },
  12: {
    title: '12月冬日遛娃',
    subtitle: '入冬降温，室内活动为主',
    emoji: '⛄',
    venueTypes: ['museum', 'indoor_park', 'library', 'science_center'],
  },
}

/** 获取当前月份推荐信息 */
export function getCurrentMonthRecommend(): { title: string; subtitle: string; emoji: string; venueTypes: string[] } {
  const month = new Date().getMonth() + 1
  return MONTH_RECOMMEND[month] ?? MONTH_RECOMMEND[1]
}

/** 根据温度和天气描述判断天气类型 */
export function inferWeatherType(temp: number, description: string): WeatherType {
  const desc = description.toLowerCase()
  if (desc.includes('雨') || desc.includes('rain')) return 'rainy'
  if (temp >= 35) return 'hot'
  if (temp <= 5) return 'cold'
  if (desc.includes('云') || desc.includes('阴') || desc.includes('cloud') || desc.includes('overcast')) return 'cloudy'
  return 'sunny'
}

/** 获取天气标签 */
export function getWeatherLabel(weather: WeatherType): string {
  return WEATHER_CONFIG[weather]?.label ?? weather
}

/** 获取天气emoji */
export function getWeatherEmoji(weather: WeatherType): string {
  return WEATHER_CONFIG[weather]?.emoji ?? '🌤️'
}

/** 天气匹配的场景类型提示 */
export function getWeatherSceneHint(weather: WeatherType): string {
  switch (weather) {
    case 'sunny':
      return '晴天适合户外活动 🌳'
    case 'rainy':
      return '雨天推荐室内场所 🏠'
    case 'cloudy':
      return '多云天气户内皆宜 🎈'
    case 'hot':
      return '高温天建议室内避暑 ❄️'
    case 'cold':
      return '寒冷天推荐室内温暖场所 🔥'
    default:
      return ''
  }
}
