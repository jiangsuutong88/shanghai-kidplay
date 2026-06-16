/** 场所类型 */
export type VenueType =
  | 'park'
  | 'museum'
  | 'farm'
  | 'playground'
  | 'aquarium'
  | 'science_center'
  | 'indoor_park'
  | 'zoo'
  | 'library'
  | 'art_studio'
  | 'swimming'
  | 'parent_child_center'

/** 天气类型 */
export type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'hot' | 'cold'

/** 年龄段 */
export interface AgeGroup {
  label: string
  minMonths: number
  maxMonths: number
  emoji: string
}

/** 预算档位 */
export interface BudgetLevel {
  label: string
  minCost: number
  maxCost: number
  emoji: string
  color: string
}

/** 预约链接 */
export interface BookingLink {
  platform: string
  url: string
  type: 'miniapp' | 'h5' | 'phone' | 'gzh' | 'mp'
}

/** 薅羊毛 - 单个平台价格 */
export interface Deal {
  /** 平台名称 */
  platform: string
  /** 平台价格 */
  price: number
  /** 购买链接 */
  url: string
  /** 平台类型 */
  type: 'meituan' | 'douyin' | 'dianping' | 'other'
}

/** 足迹记录 */
export interface VisitRecord {
  /** 场所 ID */
  venueId: string
  /** 访问时间 ISO 字符串 */
  visitedAt: string
}

/** 小红书关联 */
export interface XhsLink {
  /** 笔记标题 */
  title: string
  /** 笔记 URL */
  url: string
}

/** 评价 */
export interface VenueReview {
  sourcePlatform: string
  summary: string
  rating: number
}

/** 评价摘要 */
export interface ReviewSummary {
  summary: string
  prosKeywords: string[]
  consKeywords: string[]
  topReviews: VenueReview[]
}

/** 标签 */
export interface VenueTags {
  eduValues: string[]
  features: string[]
}

/** 交通信息 */
export interface TransportInfo {
  metro: string
  parking: boolean
  drivingMinutes: number
}

/** 场所 */
export interface Venue {
  id: string
  name: string
  address: string
  district: string
  longitude: number
  latitude: number
  minAgeMonths: number
  bestAgeMonths: number
  maxAgeMonths: number
  venueType: VenueType
  isIndoor: boolean
  avgCost: number
  /** 官方票价 */
  officialCost: number
  dpRating: number
  xhsHotScore: number
  dyInteractScore: number
  compositeScore: number
  weatherSuitability: WeatherType[]
  transportInfo: TransportInfo
  bookingLinks: BookingLink[]
  coverUrl: string
  images: string[]
  tags: VenueTags
  reviews: ReviewSummary
  pros: string[]
  cons: string[]
  /** 是否为本月新上架场所 */
  isNew: boolean
  /** 新上架月份，格式 'YYYY-MM' */
  newMonth: string
  /** 薅羊毛比价数据 */
  deals: Deal[]
  /** 关联小红书笔记 */
  xhsLinks: XhsLink[]
}

/** 推荐请求参数 */
export interface RecommendRequest {
  ageGroup: AgeGroup
  weather: WeatherType
  budget: BudgetLevel
  /** 已去过的场所 ID 列表，用于降权 */
  visitedIds?: string[]
  /** 用户经度 */
  longitude?: number
  /** 用户纬度 */
  latitude?: number
}

/** 推荐结果 */
export interface RecommendResult {
  venue: Venue
  matchScore: number
  ageMatchScore: number
  weatherMatchScore: number
}

/** 对比维度 */
export interface CompareDimension {
  label: string
  key: string
  getValue: (venue: Venue) => string | number
  getWinner?: (venues: Venue[]) => number
}

/** 步骤状态 */
export type StepStatus = 'waiting' | 'active' | 'completed'

/** 周末天气 */
export interface WeekendWeather {
  /** 星期六天气 */
  satWeather: WeatherType
  satTempHigh: number
  satTempLow: number
  /** 星期日天气 */
  sunWeather: WeatherType
  sunTempHigh: number
  sunTempLow: number
  /** 天气描述 */
  summary: string
}

/** API 通用响应 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
