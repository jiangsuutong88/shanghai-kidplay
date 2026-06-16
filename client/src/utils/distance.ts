/**
 * 使用 Haversine 公式计算两个经纬度之间的距离（单位：公里）
 */
export function calcDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // 地球半径（公里）
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10
}

/**
 * 角度转弧度
 */
function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * 格式化距离显示
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

/**
 * 根据距离判断交通方式建议
 */
export function getTransportSuggestion(km: number): string {
  if (km <= 3) return '步行可达'
  if (km <= 10) return '建议地铁出行'
  if (km <= 20) return '建议驾车前往'
  return '较远，建议驾车前往'
}

/** 上海市中心坐标 */
const SH_CENTER = { lat: 31.2304, lng: 121.4737 }

/**
 * 计算场所距离上海市中心的距离
 */
export function calcDistanceFromCenter(lat: number, lng: number): number {
  return calcDistance(SH_CENTER.lat, SH_CENTER.lng, lat, lng)
}
