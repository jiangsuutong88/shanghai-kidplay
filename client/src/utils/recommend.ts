import type { Venue, RecommendRequest, RecommendResult, WeatherType } from '../types'
import { getAllVenues } from '../data/venues'

/**
 * 年龄匹配度计算
 * 根据用户选择的年龄段与场所适合年龄的匹配程度打分
 */
function calcAgeMatchScore(venue: Venue, request: RecommendRequest): number {
  const { ageGroup } = request
  const userMin = ageGroup.minMonths
  const userMax = ageGroup.maxMonths
  const venueMin = venue.minAgeMonths
  const venueMax = venue.maxAgeMonths
  const venueBest = venue.bestAgeMonths

  // 场所适合年龄与用户年龄段无交集，得0分
  if (venueMax < userMin || venueMin > userMax) {
    return 0
  }

  // 计算重叠区间
  const overlapMin = Math.max(userMin, venueMin)
  const overlapMax = Math.min(userMax, venueMax)
  const overlapRange = overlapMax - overlapMin

  // 用户年龄段范围
  const userRange = userMax - userMin

  // 防御：用户年龄段范围为0时（单月龄），只要存在交集即满分
  if (userRange === 0) return 1

  // 重叠比例
  const overlapRatio = overlapRange / userRange

  // 最佳月龄是否在用户年龄段内
  const bestAgeInRange = venueBest >= userMin && venueBest <= userMax
  const bestAgeBonus = bestAgeInRange ? 0.3 : 0

  // 最佳月龄越接近用户年龄段的中间值，加分越多
  const userMid = (userMin + userMax) / 2
  const bestAgeDistance = Math.abs(venueBest - userMid) / userRange
  const proximityBonus = Math.max(0, 0.2 * (1 - bestAgeDistance))

  return Math.min(1, overlapRatio + bestAgeBonus + proximityBonus)
}

/**
 * 天气匹配度计算
 */
function calcWeatherMatchScore(venue: Venue, weather: WeatherType): number {
  if (venue.weatherSuitability.includes(weather)) {
    return 1.0
  }

  // 如果天气是极端天气（高温/寒冷/雨天），室内场所部分匹配
  if ((weather === 'rainy' || weather === 'hot' || weather === 'cold') && venue.isIndoor) {
    return 0.5
  }

  // 戶外场所在不匹配天气下降分
  return 0
}

/**
 * 距离匹配度计算
 * 根据用户位置与场所的距离，越近得分越高
 */
function calcDistanceScore(venue: Venue, request: RecommendRequest): number {
  // 如果没有用户位置，不参与评分
  if (request.longitude == null || request.latitude == null) {
    return 0
  }

  const userLng = request.longitude
  const userLat = request.latitude
  const venueLng = venue.longitude
  const venueLat = venue.latitude

  // 简单距离计算（欧几里得近似，单位：度）
  const distDegrees = Math.sqrt(
    Math.pow(userLng - venueLng, 2) + Math.pow(userLat - venueLat, 2)
  )

  // 转换为大致公里数（上海纬度约31度，1度经度约95km，1度纬度约111km）
  const distKm = distDegrees * 103

  // 0-5km: 1.0, 5-20km: 0.8-1.0, 20-50km: 0.5-0.8, >50km: 0.3
  if (distKm <= 5) return 1.0
  if (distKm <= 20) return 0.8 + 0.2 * (20 - distKm) / 15
  if (distKm <= 50) return 0.5 + 0.3 * (50 - distKm) / 30
  return 0.3
}

/**
 * 已去过场所降权
 * 已去过的场所排到后面
 */
function calcVisitPenalty(venue: Venue, visitedIds: string[]): number {
  if (visitedIds.length === 0) return 1.0
  if (visitedIds.includes(venue.id)) return 0.3  // 大幅降权
  return 1.0
}

/**
 * 新场所加分
 * 本月新上架的场所获得额外加分
 */
function calcNewVenueBonus(venue: Venue): number {
  if (!venue.isNew) return 0
  return 0.2  // 新场所额外加0.2分
}

/**
 * 筛选场所
 */
function filterVenues(request: RecommendRequest): Venue[] {
  const { ageGroup, weather, budget } = request
  const allVenues = getAllVenues()

  return allVenues.filter((venue) => {
    // 年龄过滤：场所最低适用月龄 <= 用户年龄段最大月龄
    // 且场所最大适用月龄 >= 用户年龄段最小月龄（有交集即可）
    const ageOk = venue.minAgeMonths <= ageGroup.maxMonths && venue.maxAgeMonths >= ageGroup.minMonths

    // 天气过滤：用户天气条件 ∈ 场所天气适配列表，或者室内场所对极端天气部分兼容
    const weatherOk = venue.weatherSuitability.includes(weather) ||
      ((weather === 'rainy' || weather === 'hot' || weather === 'cold') && venue.isIndoor)

    // 预算过滤：场所平均费用在用户选择的预算范围内
    const budgetOk = venue.avgCost >= budget.minCost && venue.avgCost < budget.maxCost

    return ageOk && weatherOk && budgetOk
  })
}

/**
 * 计算场所类型和区域的多样性
 * 确保推荐结果中不会都是同一类型或同一区域
 */
function calcDiversity(venue: Venue, selected: Venue[]): number {
  let diversity = 1.0

  for (const s of selected) {
    // 同类型扣分
    if (s.venueType === venue.venueType) {
      diversity *= 0.6
    }
    // 同区域扣分
    if (s.district === venue.district) {
      diversity *= 0.7
    }
  }

  return diversity
}

/**
 * 推荐算法主函数
 * 返回 Top3 推荐结果，确保不同 venueType、不同区域
 * 支持已去过场所降权、新场所优先、距离近优先
 */
export function getRecommendations(request: RecommendRequest): RecommendResult[] {
  const visitedIds = request.visitedIds || []

  // Step 1: 筛选
  const filtered = filterVenues(request)

  if (filtered.length === 0) {
    return []
  }

  // Step 2: 计算每个场所的综合匹配分
  const scored: RecommendResult[] = filtered.map((venue) => {
    const ageMatchScore = calcAgeMatchScore(venue, request)
    const weatherMatchScore = calcWeatherMatchScore(venue, request.weather)
    const distanceScore = calcDistanceScore(venue, request)
    const visitPenalty = calcVisitPenalty(venue, visitedIds)
    const newBonus = calcNewVenueBonus(venue)

    // 综合评分 = 口碑*0.3 + 年龄*0.25 + 天气*0.2 + 距离*0.15 + 新场所*0.1
    // 然后乘以已去过降权系数
    const matchScore = (
      venue.compositeScore * 0.3 +
      ageMatchScore * 0.25 +
      weatherMatchScore * 0.2 +
      distanceScore * 0.15 +
      newBonus * 0.1
    ) * visitPenalty

    return {
      venue,
      matchScore,
      ageMatchScore,
      weatherMatchScore,
    }
  })

  // Step 3: 按 matchScore 排序
  scored.sort((a, b) => b.matchScore - a.matchScore)

  // Step 4: 选取差异度最大的 Top3
  const top3: RecommendResult[] = []

  for (const item of scored) {
    if (top3.length >= 3) break

    const diversity = calcDiversity(item.venue, top3.map((r) => r.venue))
    // 差异度足够，或候选不够时放宽条件
    if (diversity >= 0.5 || top3.length < 2) {
      top3.push(item)
    }
  }

  // 如果还不够3个，从剩余中补充
  if (top3.length < 3) {
    for (const item of scored) {
      if (top3.length >= 3) break
      if (!top3.find((t) => t.venue.id === item.venue.id)) {
        top3.push(item)
      }
    }
  }

  return top3
}

/**
 * 获取天气备选方案
 * 当天气不匹配时，推荐室内替代方案
 */
export function getWeatherAlternative(request: RecommendRequest): Venue | null {
  const { ageGroup, budget, visitedIds } = request
  const allVenues = getAllVenues()
  const ids = visitedIds || []

  // 只看室内场所
  const indoorVenues = allVenues.filter((v) => {
    const ageOk = v.minAgeMonths <= ageGroup.maxMonths && v.maxAgeMonths >= ageGroup.minMonths
    const budgetOk = v.avgCost >= budget.minCost && v.avgCost < budget.maxCost
    return v.isIndoor && ageOk && budgetOk
  })

  if (indoorVenues.length === 0) return null

  // 优先推荐没去过的
  const notVisited = indoorVenues.filter((v) => !ids.includes(v.id))
  const candidates = notVisited.length > 0 ? notVisited : indoorVenues

  // 返回综合评分最高的
  candidates.sort((a, b) => b.compositeScore - a.compositeScore)
  return candidates[0]
}
