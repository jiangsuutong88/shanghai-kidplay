import { View, Text } from '@tarojs/components'
import type { Venue } from '../../types'
import { formatCost, formatAgeRange } from '../../utils/format'
import { calcDistanceFromCenter, formatDistance } from '../../utils/distance'
import TagBadge from '../TagBadge'
import './index.scss'

interface VenueInfoProps {
  venue: Venue
}

export default function VenueInfo({ venue }: VenueInfoProps) {
  const distance = calcDistanceFromCenter(venue.latitude, venue.longitude)

  return (
    <View className='venue-info'>
      {/* 基础信息 */}
      <View className='venue-info__section'>
        <Text className='venue-info__section-title'>基础信息</Text>

        <View className='venue-info__grid'>
          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>📍 地址</Text>
            <Text className='venue-info__item-value'>{venue.address}</Text>
          </View>

          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>⭐ 评分</Text>
            <Text className='venue-info__item-value'>{venue.compositeScore.toFixed(1)} 分</Text>
          </View>

          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>💰 费用</Text>
            <Text className='venue-info__item-value'>{formatCost(venue.avgCost)}</Text>
          </View>

          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>👶 适合年龄</Text>
            <Text className='venue-info__item-value'>{formatAgeRange(venue.minAgeMonths, venue.maxAgeMonths)}</Text>
          </View>

          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>🕐 建议时长</Text>
            <Text className='venue-info__item-value'>
              {venue.isIndoor ? '2-4小时' : '3-5小时'}
            </Text>
          </View>

          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>{venue.isIndoor ? '🏠' : '🌳'} 类型</Text>
            <Text className='venue-info__item-value'>{venue.isIndoor ? '室内场所' : '户外场所'}</Text>
          </View>

          <View className='venue-info__item'>
            <Text className='venue-info__item-label'>📏 距市中心</Text>
            <Text className='venue-info__item-value'>{formatDistance(distance)}</Text>
          </View>
        </View>
      </View>

      {/* 早教价值标签 */}
      <View className='venue-info__section'>
        <Text className='venue-info__section-title'>早教价值</Text>
        <View className='venue-info__tags'>
          {venue.tags.eduValues.map((tag) => (
            <TagBadge key={tag} label={tag} type='edu' />
          ))}
        </View>
        <View className='venue-info__tags'>
          {venue.tags.features.map((tag) => (
            <TagBadge key={tag} label={tag} type='feature' />
          ))}
        </View>
      </View>

      {/* 交通指引 */}
      <View className='venue-info__section'>
        <Text className='venue-info__section-title'>交通指引</Text>
        <View className='venue-info__transport'>
          {venue.transportInfo.metro && (
            <View className='venue-info__transport-item'>
              <Text className='venue-info__transport-icon'>🚇</Text>
              <Text className='venue-info__transport-text'>{venue.transportInfo.metro}</Text>
            </View>
          )}
          <View className='venue-info__transport-item'>
            <Text className='venue-info__transport-icon'>🚗</Text>
            <Text className='venue-info__transport-text'>
              驾车约{venue.transportInfo.drivingMinutes}分钟
              {venue.transportInfo.parking ? ' · 有停车场' : ' · 无停车场'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
