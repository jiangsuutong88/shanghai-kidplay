import Taro from '@tarojs/taro'
import { useUserStore } from '../stores/useUserStore'

/**
 * 定位服务
 * 封装微信小程序定位API
 */

/** 定位结果 */
export interface LocationResult {
  latitude: number
  longitude: number
  accuracy: number
}

/**
 * 获取用户当前位置
 * 优先使用微信定位，失败则使用上海市中心坐标
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  const userStore = useUserStore.getState()

  // 如果已有授权位置，直接返回
  if (userStore.latitude && userStore.longitude) {
    return {
      latitude: userStore.latitude,
      longitude: userStore.longitude,
      accuracy: 0,
    }
  }

  try {
    const res = await Taro.getLocation({
      type: 'gcj02',
    })

    userStore.setLocation(res.latitude, res.longitude)

    return {
      latitude: res.latitude,
      longitude: res.longitude,
      accuracy: res.accuracy,
    }
  } catch (err) {
    console.warn('定位失败，使用上海默认位置', err)

    // 使用上海市中心坐标
    const defaultLocation: LocationResult = {
      latitude: 31.2304,
      longitude: 121.4737,
      accuracy: -1,
    }

    userStore.setLocation(defaultLocation.latitude, defaultLocation.longitude)
    userStore.setLocationAuthorized(false)

    return defaultLocation
  }
}

/**
 * 请求定位授权
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const res = await Taro.getSetting()
    if (res.authSetting['scope.userLocation'] === false) {
      // 用户已拒绝，引导去设置
      await Taro.showModal({
        title: '定位权限',
        content: '需要获取您的位置以推荐附近场所，请在设置中开启定位权限',
        confirmText: '去设置',
      })
      await Taro.openSetting()
      return false
    }
    return true
  } catch {
    return false
  }
}
