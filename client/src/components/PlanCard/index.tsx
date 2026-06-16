import { View, Text, Image } from '@tarojs/components'
import type { ITouchEvent } from '@tarojs/components/types/common'
import Taro from '@tarojs/taro'
import type { RecommendResult, WeatherType } from '../../types'
import { formatCost } from '../../utils/format'
import { calcDistanceFromCenter, formatDistance } from '../../utils/distance'
import { WEATHER_CONFIG } from '../../constants/weatherTypes'
import TagBadge from '../TagBadge'
import './index.scss'

interface PlanCardProps {
  result: RecommendResult
  rank: number
  weather: WeatherType
  onAddCompare: () => void
}

export default function PlanCard({ result, rank, weather, onAddCompare }: PlanCardProps) {
  const { venue, matchScore } = result
  const distance = calcDistanceFromCenter(venue.latitude, venue.longitude)
  const weatherConfig = WEATHER_CONFIG[weather]

  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${venue.id}`,
    })
  }

  const handleCompareClick = (e: ITouchEvent) => {
    e.stopPropagation()
    onAddCompare()
  }

  const rankColors = ['#FB923C', '#60A5FA', '#34D399']
  const rankColor = rankColors[rank - 1] || '#9CA3AF'

  return (
    <View className='plan-card' onClick={handleCardClick}>
      {/* 排名标签 */}
      <View className='plan-card__rank' style={{ backgroundColor: rankColor }}>
        <Text className='plan-card__rank-text'>Top{rank}</Text>
      </View>

      {/* 封面图 */}
      <View className='plan-card__cover'>
        <Image
          className='plan-card__cover-img'
          src={venue.coverUrl}
          mode='aspectFill'
        />
        <View className='plan-card__weather-badge'>
          <Text className='plan-card__weather-emoji'>{weatherConfig.emoji}</Text>
          <Text className='plan-card__weather-text'>{weatherConfig.label}</Text>
        </View>
      </View>

      {/* 内容区 */}
      <View className='plan-card__content'>
        <View className='plan-card__header'>
          <Text className='plan-card__name'>
            {venue.name}
            {venue.isNew && <Text className='plan-card__new-tag'>新</Text>}
          </Text>
          <View className='plan-card__score'>
            <Text className='plan-card__score-num'>{venue.compositeScore.toFixed(1)}</Text>
            <Text className='plan-card__score-label'>综合评分</Text>
          </View>
        </View>

        <View className='plan-card__meta'>
          <View className='plan-card__meta-item'>
            <Text className='plan-card__meta-icon'>💰</Text>
            <Text className='plan-card__meta-text'>{formatCost(venue.avgCost)}</Text>
          </View>
          <View className='plan-card__meta-item'>
            <Text className='plan-card__meta-icon'>📍</Text>
            <Text className='plan-card__meta-text'>{venue.district} · {formatDistance(distance)}</Text>
          </View>
          <View className='plan-card__meta-item'>
            <Text className='plan-card__meta-icon'>{venue.isIndoor ? '🏠' : '🌳'}</Text>
            <Text className='plan-card__meta-text'>{venue.isIndoor ? '室内' : '户外'}</Text>
          </View>
        </View>

        {/* 早教标签 */}
        <View className='plan-card__tags'>
          {venue.tags.eduValues.slice(0, 3).map((tag) => (
            <TagBadge key={tag} label={tag} type='edu' />
          ))}
        </View>

        {/* 匹配度 */}
        <View className='plan-card__match'>
          <View className='plan-card__match-bar'>
            <View
              className='plan-card__match-fill'
              style={{ width: `${Math.round(matchScore * 100)}%` }}
            />
          </View>
          <Text className='plan-card__match-text'>匹配度 {Math.round(matchScore * 100)}%</Text>
        </View>

        {/* 加入对比按钮 */}
        <View className='plan-card__compare-btn' onClick={handleCompareClick}>
          <Text className='plan-card__compare-btn-text'>+ 加入对比</Text>
        </View>
      </View>
    </View>
  )
}
