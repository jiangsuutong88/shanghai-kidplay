import Taro from '@tarojs/taro'
import type { RecommendRequest, RecommendResult, Venue, WeekendWeather, Deal } from '../types'
import { getRecommendations, getWeatherAlternative } from '../utils/recommend'
import { getVenueById } from '../data/venues'

/** 后端 API 基础地址 */
const API_BASE = 'https://your-domain.com/api/v1'

/**
 * 推荐服务
 * 封装推荐算法调用，提供业务层面的接口
 * 优先调用后端真实 API，失败后降级到本地 Mock
 */

/** 生成推荐结果 - 本地 Mock 降级版本 */
function getLocalRecommend(request: RecommendRequest): RecommendResult[] {
  return getRecommendations(request)
}

/** 获取天气备选 - 本地 Mock 降级版本 */
function getLocalAlternative(request: RecommendRequest): Venue | null {
  return getWeatherAlternative(request)
}

/**
 * 获取 Top3 推荐
 * 优先调用后端 API，失败后降级到本地推荐算法
 */
export async function getTop3Recommend(params: {
  ageGroup: string
  budgetLevel: string
  weather?: string
  longitude?: number
  latitude?: number
  userId?: string
}): Promise<RecommendResult[]> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/recommend/top3`,
      method: 'GET',
      data: params,
    })
    if (res.data?.code === 0 && Array.isArray(res.data.data)) {
      return res.data.data
    }
    throw new Error(res.data?.message || '推荐接口异常')
  } catch (e) {
    console.warn('后端推荐接口失败，降级到本地推荐', e)
    // 降级到本地 Mock
    return []
  }
}

/**
 * 获取场所详情
 * 优先调用后端 API，失败后降级到本地数据
 */
export async function getVenueDetail(venueId: string): Promise<Venue | null> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/venues/${venueId}`,
      method: 'GET',
    })
    if (res.data?.code === 0 && res.data.data) {
      return res.data.data as Venue
    }
    throw new Error(res.data?.message || '场所详情接口异常')
  } catch (e) {
    console.warn('后端场所详情失败，降级到本地数据', e)
    return getVenueById(venueId) || null
  }
}

/**
 * 获取周末天气
 * 优先调用后端 API，失败后返回 null
 */
export async function getWeekendWeather(): Promise<WeekendWeather | null> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/weather/weekend`,
      method: 'GET',
    })
    if (res.data?.code === 0 && res.data.data) {
      return res.data.data as WeekendWeather
    }
    throw new Error(res.data?.message || '天气接口异常')
  } catch (e) {
    console.warn('后端天气接口失败', e)
    return null
  }
}

/**
 * 获取场所薅羊毛比价
 * 优先调用后端 API，失败后使用场所自带 deals 数据
 */
export async function getVenueDeals(venueId: string): Promise<Deal[]> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/deals/venue/${venueId}`,
      method: 'GET',
    })
    if (res.data?.code === 0 && Array.isArray(res.data.data)) {
      return res.data.data as Deal[]
    }
    throw new Error(res.data?.message || '比价接口异常')
  } catch (e) {
    console.warn('后端比价接口失败，使用本地 deals 数据', e)
    // 降级到场所自带的 deals 数据
    const venue = getVenueById(venueId)
    return venue?.deals || []
  }
}

/**
 * 标记场所为已去过
 */
export async function markVisited(venueId: string): Promise<boolean> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/visits`,
      method: 'POST',
      data: { venueId, visitedAt: new Date().toISOString() },
    })
    return res.data?.code === 0
  } catch (e) {
    console.warn('后端标记已去过失败', e)
    return false
  }
}

/**
 * 取消已去过标记
 */
export async function unmarkVisited(venueId: string): Promise<boolean> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/visits/${venueId}`,
      method: 'DELETE',
    })
    return res.data?.code === 0
  } catch (e) {
    console.warn('后端取消已去过失败', e)
    return false
  }
}

/**
 * 获取足迹列表
 */
export async function getVisitList(): Promise<string[]> {
  try {
    const res = await Taro.request({
      url: `${API_BASE}/visits`,
      method: 'GET',
    })
    if (res.data?.code === 0 && Array.isArray(res.data.data)) {
      return res.data.data.map((r: { venueId: string }) => r.venueId)
    }
    throw new Error(res.data?.message || '足迹接口异常')
  } catch (e) {
    console.warn('后端足迹接口失败', e)
    return []
  }
}

/** 生成推荐结果（本地同步版本，用于 store 内部调用） */
export function generateRecommendations(request: RecommendRequest): RecommendResult[] {
  return getRecommendations(request)
}

/** 获取天气备选方案（本地同步版本） */
export function getAlternativeVenue(request: RecommendRequest): Venue | null {
  return getWeatherAlternative(request)
}

/** 获取推荐理由文本 */
export function getMatchReasonText(result: RecommendResult): string {
  const reasons: string[] = []

  if (result.ageMatchScore >= 0.8) {
    reasons.push('年龄段高度匹配')
  } else if (result.ageMatchScore >= 0.5) {
    reasons.push('年龄段较匹配')
  }

  if (result.weatherMatchScore >= 1.0) {
    reasons.push('天气完全适配')
  } else if (result.weatherMatchScore >= 0.5) {
    reasons.push('天气部分适配')
  }

  if (result.venue.compositeScore >= 4.5) {
    reasons.push('口碑极佳')
  } else if (result.venue.compositeScore >= 4.0) {
    reasons.push('口碑良好')
  }

  if (result.venue.isNew) {
    reasons.push('新上架')
  }

  return reasons.join(' · ') || '综合推荐'
}
