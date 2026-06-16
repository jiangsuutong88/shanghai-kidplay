import { create } from 'zustand'
import Taro from '@tarojs/taro'
import type { VisitRecord } from '../types'

/** 本地存储 key */
const VISIT_STORAGE_KEY = 'kidplay_visited_ids'

interface VisitStore {
  /** 已去过的场所 ID 列表 */
  visitedIds: string[]
  /** 是否正在加载 */
  isLoading: boolean

  // Actions
  /** 添加已去过标记 */
  addVisit: (venueId: string) => void
  /** 移除已去过标记 */
  removeVisit: (venueId: string) => void
  /** 从本地缓存加载足迹 */
  loadVisits: () => Promise<void>
  /** 检查场所是否已去过 */
  isVisited: (venueId: string) => boolean
  /** 清空所有足迹 */
  clearVisits: () => void
}

export const useVisitStore = create<VisitStore>((set, get) => ({
  visitedIds: [],
  isLoading: false,

  addVisit: (venueId: string) => {
    const { visitedIds } = get()
    if (visitedIds.includes(venueId)) return

    const newIds = [...visitedIds, venueId]
    set({ visitedIds: newIds })

    // 持久化到本地
    try {
      Taro.setStorageSync(VISIT_STORAGE_KEY, JSON.stringify(newIds))
    } catch (err) {
      console.warn('保存足迹失败', err)
    }

    // 尝试同步到后端（体验版静默失败）
    syncVisitToServer(venueId).catch(() => {
      // 静默失败，本地已保存
    })
  },

  removeVisit: (venueId: string) => {
    const { visitedIds } = get()
    const newIds = visitedIds.filter((id) => id !== venueId)
    set({ visitedIds: newIds })

    // 持久化到本地
    try {
      Taro.setStorageSync(VISIT_STORAGE_KEY, JSON.stringify(newIds))
    } catch (err) {
      console.warn('移除足迹失败', err)
    }

    // 尝试同步到后端（体验版静默失败）
    removeVisitFromServer(venueId).catch(() => {
      // 静默失败，本地已移除
    })
  },

  loadVisits: async () => {
    set({ isLoading: true })
    try {
      // 优先从后端加载
      const serverIds = await loadVisitsFromServer()
      if (serverIds.length > 0) {
        set({ visitedIds: serverIds, isLoading: false })
        // 同步到本地缓存
        Taro.setStorageSync(VISIT_STORAGE_KEY, JSON.stringify(serverIds))
        return
      }
    } catch {
      // 后端加载失败，从本地加载
    }

    // 从本地缓存加载
    try {
      const stored = Taro.getStorageSync(VISIT_STORAGE_KEY)
      if (stored) {
        const ids: string[] = JSON.parse(stored)
        set({ visitedIds: ids })
      }
    } catch (err) {
      console.warn('加载足迹失败', err)
    } finally {
      set({ isLoading: false })
    }
  },

  isVisited: (venueId: string) => {
    return get().visitedIds.includes(venueId)
  },

  clearVisits: () => {
    set({ visitedIds: [] })
    try {
      Taro.removeStorageSync(VISIT_STORAGE_KEY)
    } catch {
      // ignore
    }
  },
}))

/** 同步足迹到后端 */
async function syncVisitToServer(venueId: string): Promise<void> {
  const API_BASE = 'https://your-domain.com/api/v1'
  const res = await Taro.request({
    url: `${API_BASE}/visits`,
    method: 'POST',
    data: { venueId, visitedAt: new Date().toISOString() },
  })
  if (res.data?.code !== 0) {
    throw new Error(res.data?.message || '同步失败')
  }
}

/** 从后端移除足迹 */
async function removeVisitFromServer(venueId: string): Promise<void> {
  const API_BASE = 'https://your-domain.com/api/v1'
  const res = await Taro.request({
    url: `${API_BASE}/visits/${venueId}`,
    method: 'DELETE',
  })
  if (res.data?.code !== 0) {
    throw new Error(res.data?.message || '移除失败')
  }
}

/** 从后端加载足迹列表 */
async function loadVisitsFromServer(): Promise<string[]> {
  const API_BASE = 'https://your-domain.com/api/v1'
  const res = await Taro.request({
    url: `${API_BASE}/visits`,
    method: 'GET',
  })
  if (res.data?.code === 0 && Array.isArray(res.data.data)) {
    return res.data.data.map((r: VisitRecord) => r.venueId)
  }
  throw new Error('后端足迹加载失败')
}
