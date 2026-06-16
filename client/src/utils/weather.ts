import Taro from '@tarojs/taro'
import type { WeatherType } from '../types'

/** 上海市中心坐标 */
const SHANGHAI_CENTER = {
  latitude: 31.2304,
  longitude: 121.4737,
}

/** 天气判断结果 */
export interface WeatherResult {
  weather: WeatherType
  temp: number
  description: string
  isAutoDetected: boolean
}

/**
 * 获取天气信息
 * 优先使用微信定位 + 简单天气判断
 * 失败则默认上海晴天
 */
export async function detectWeather(): Promise<WeatherResult> {
  try {
    // 尝试获取位置
    const locationRes = await Taro.getLocation({
      type: 'gcj02',
    })

    const latitude = locationRes.latitude
    const longitude = locationRes.longitude

    // 简单判断：根据月份和时间段估算天气
    // 真实场景应接入天气API
    const weather = inferWeatherByLocation(latitude, longitude)
    const temp = estimateTempByMonth()

    return {
      weather,
      temp,
      description: getWeatherDescription(weather, temp),
      isAutoDetected: true,
    }
  } catch (err) {
    // 定位失败，默认上海晴天
    console.warn('定位失败，使用默认天气', err)
    return {
      weather: 'sunny',
      temp: estimateTempByMonth(),
      description: '上海 · 晴天（默认）',
      isAutoDetected: false,
    }
  }
}

/**
 * 根据位置和月份推算天气
 * 纯前端简化版，不做真实天气API调用
 */
function inferWeatherByLocation(_latitude: number, _longitude: number): WeatherType {
  const month = new Date().getMonth() + 1
  const hour = new Date().getHours()

  // 上海天气简化模型
  // 夏季（6-9月）: 高温概率大
  if (month >= 6 && month <= 9) {
    if (hour >= 11 && hour <= 15) return 'hot'
    // 夏季多雷阵雨
    if (Math.random() > 0.6) return 'rainy'
    return 'sunny'
  }

  // 冬季（12-2月）: 寒冷
  if (month <= 2 || month === 12) {
    if (Math.random() > 0.7) return 'rainy'
    return 'cold'
  }

  // 春秋季: 多云或晴天
  if (Math.random() > 0.5) return 'cloudy'
  return 'sunny'
}

/**
 * 根据月份估算温度
 */
function estimateTempByMonth(): number {
  const month = new Date().getMonth() + 1
  const tempMap: Record<number, number> = {
    1: 4,
    2: 5,
    3: 10,
    4: 16,
    5: 22,
    6: 26,
    7: 32,
    8: 32,
    9: 27,
    10: 20,
    11: 13,
    12: 6,
  }
  return tempMap[month] ?? 20
}

/**
 * 获取天气描述
 */
function getWeatherDescription(weather: WeatherType, temp: number): string {
  const weatherNames: Record<WeatherType, string> = {
    sunny: '晴天',
    cloudy: '多云',
    rainy: '阴雨天',
    hot: '高温',
    cold: '寒冷',
  }
  return `上海 · ${weatherNames[weather]} · ${temp}°C`
}

/**
 * 导出默认上海中心坐标
 */
export function getShanghaiCenter() {
  return SHANGHAI_CENTER
}
