import { create } from 'zustand'

interface UserState {
  /** 用户位置纬度 */
  latitude: number | null
  /** 用户位置经度 */
  longitude: number | null
  /** 是否已授权定位 */
  locationAuthorized: boolean

  // Actions
  setLocation: (lat: number, lng: number) => void
  setLocationAuthorized: (authorized: boolean) => void
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  latitude: null,
  longitude: null,
  locationAuthorized: false,

  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng, locationAuthorized: true }),
  setLocationAuthorized: (authorized) => set({ locationAuthorized: authorized }),
  reset: () => set({ latitude: null, longitude: null, locationAuthorized: false }),
}))
