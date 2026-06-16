import { View, Text } from '@tarojs/components'
import type { Deal } from '../../types'
import './index.scss'

interface DealCardProps {
  /** 薅羊毛比价数据 */
  deals: Deal[]
  /** 官方票价 */
  officialCost: number
}

/** 平台显示名称映射 */
const PLATFORM_LABELS: Record<string, string> = {
  meituan: '美团',
  douyin: '抖音团购',
  dianping: '大众点评',
  other: '其他',
}

/** 平台图标映射 */
const PLATFORM_ICONS: Record<string, string> = {
  meituan: '🐼',
  douyin: '🎵',
  dianping: '⭐',
  other: '💰',
}

export default function DealCard({ deals, officialCost }: DealCardProps) {
  // 没有比价数据时不显示
  if (!deals || deals.length === 0) return null

  // 计算最低价
  const minPrice = Math.min(...deals.map((d) => d.price))
  // 计算省多少钱
  const savedAmount = officialCost - minPrice
  // 是否有优惠
  const hasDiscount = savedAmount > 0

  return (
    <View className='deal-card'>
      <View className='deal-card__header'>
        <Text className='deal-card__title'>🐑 薅羊毛比价</Text>
        {hasDiscount && (
          <View className='deal-card__save-badge'>
            <Text className='deal-card__save-text'>省{savedAmount}元</Text>
          </View>
        )}
      </View>

      {/* 官方价 */}
      <View className='deal-card__official'>
        <Text className='deal-card__official-label'>官方票价</Text>
        <Text className='deal-card__official-price'>¥{officialCost}</Text>
      </View>

      {/* 各平台比价 */}
      <View className='deal-card__platforms'>
        {deals.map((deal, index) => {
          const isLowest = deal.price === minPrice
          return (
            <View
              key={`${deal.platform}-${index}`}
              className={`deal-card__platform ${isLowest ? 'deal-card__platform--lowest' : ''}`}
            >
              <View className='deal-card__platform-left'>
                <Text className='deal-card__platform-icon'>
                  {PLATFORM_ICONS[deal.type] || '💰'}
                </Text>
                <Text className='deal-card__platform-name'>
                  {PLATFORM_LABELS[deal.type] || deal.platform}
                </Text>
              </View>
              <View className='deal-card__platform-right'>
                <Text className='deal-card__platform-price'>¥{deal.price}</Text>
                {isLowest && (
                  <View className='deal-card__lowest-tag'>
                    <Text className='deal-card__lowest-tag-text'>最低</Text>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>

      {/* 价格提示 */}
      <View className='deal-card__disclaimer'>
        <Text className='deal-card__disclaimer-text'>
          ⚠️ 价格可能随时变动，以实际购买时为准
        </Text>
      </View>
    </View>
  )
}
