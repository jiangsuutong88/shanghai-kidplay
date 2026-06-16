import { create } from 'zustand'
import type { Venue, RecommendRequest, RecommendResult, WeatherType, AgeGroup, BudgetLevel } from '../types'
import { getRecommendations, getWeatherAlternative } from '../utils/recommend'
import { useVisitStore } from './useVisitStore'
import { useUserStore } from './useUserStore'

interface RecommendState {
  /** 当前步骤 (1-3) */
  currentStep: number
  /** 选择的年龄段 */
  selectedAgeGroup: AgeGroup | null
  /** 选择的天气 */
  selectedWeather: WeatherType | null
  /** 天气是否自动检测 */
  isWeatherAutoDetected: boolean
  /** 选择的预算档位 */
  selectedBudget: BudgetLevel | null
  /** 推荐结果 */
  results: RecommendResult[]
  /** 天气备选方案 */
  weatherAlternative: Venue | null
  /** 对比列表 */
  compareList: Venue[]

  // Actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  selectAgeGroup: (ageGroup: AgeGroup) => void
  selectWeather: (weather: WeatherType) => void
  setWeatherAutoDetected: (auto: boolean) => void
  selectBudget: (budget: BudgetLevel) => void
  generateRecommendations: () => void
  addToCompare: (venue: Venue) => void
  removeFromCompare: (venueId: string) => void
  clearCompare: () => void
  reset: () => void
}

const initialState = {
  currentStep: 1,
  selectedAgeGroup: null,
  selectedWeather: null,
  isWeatherAutoDetected: false,
  selectedBudget: null,
  results: [],
  weatherAlternative: null,
  compareList: [],
}

export const useRecommendStore = create<RecommendState>((set, get) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get()
    if (currentStep < 3) {
      set({ currentStep: currentStep + 1 })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 })
    }
  },

  selectAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),

  selectWeather: (weather) => set({ selectedWeather: weather }),

  setWeatherAutoDetected: (auto) => set({ isWeatherAutoDetected: auto }),

  selectBudget: (budget) => set({ selectedBudget: budget }),

  generateRecommendations: () => {
    const { selectedAgeGroup, selectedWeather, selectedBudget } = get()

    if (!selectedAgeGroup || !selectedWeather || !selectedBudget) {
      console.warn('请先完成所有选择')
      return
    }

    // 从 useVisitStore 获取已去过的场所 ID
    const visitedIds = useVisitStore.getState().visitedIds
    // 从 useUserStore 获取用户位置
    const userStore = useUserStore.getState()

    const request: RecommendRequest = {
      ageGroup: selectedAgeGroup,
      weather: selectedWeather,
      budget: selectedBudget,
      visitedIds,
      longitude: userStore.longitude ?? undefined,
      latitude: userStore.latitude ?? undefined,
    }

    const results = getRecommendations(request)
    const weatherAlternative = getWeatherAlternative(request)

    set({ results, weatherAlternative })
  },

  addToCompare: (venue) => {
    const { compareList } = get()
    if (compareList.length >= 3) {
      console.warn('对比列表最多3个')
      return
    }
    if (compareList.find((v) => v.id === venue.id)) {
      return
    }
    set({ compareList: [...compareList, venue] })
  },

  removeFromCompare: (venueId) => {
    const { compareList } = get()
    set({ compareList: compareList.filter((v) => v.id !== venueId) })
  },

  clearCompare: () => set({ compareList: [] }),

  reset: () => set(initialState),
}))
