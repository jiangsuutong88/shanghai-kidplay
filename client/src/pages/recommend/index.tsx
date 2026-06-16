import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRecommendStore } from '../../stores/useRecommendStore'
import PlanCard from '../../components/PlanCard'
import EmptyState from '../../components/EmptyState'
import { WEATHER_CONFIG, getWeatherSceneHint } from '../../constants/weatherTypes'
import './index.scss'

export default function Recommend() {
  const {
    results,
    weatherAlternative,
    selectedWeather,
    addToCompare,
    compareList,
  } = useRecommendStore()

  const handleAddCompare = (venueId: string) => {
    const venue = results.find((r) => r.venue.id === venueId)?.venue
    if (venue) {
      if (compareList.length >= 3) {
        Taro.showToast({
          title: '对比列表已满（最多3个）',
          icon: 'none',
        })
        return
      }
      if (compareList.find((v) => v.id === venueId)) {
        Taro.showToast({
          title: '已在对比列表中',
          icon: 'none',
        })
        return
      }
      addToCompare(venue)
      Taro.showToast({
        title: '已加入对比',
        icon: 'success',
      })
    }
  }

  const handleGoCompare = () => {
    if (compareList.length < 2) {
      Taro.showToast({
        title: '请至少添加2个方案对比',
        icon: 'none',
      })
      return
    }
    Taro.navigateTo({
      url: '/pages/compare/index',
    })
  }

  if (results.length === 0) {
    return (
      <View className='recommend'>
        <EmptyState
          title='未找到匹配方案'
          subtitle='请返回首页调整筛选条件'
          icon='😔'
        />
      </View>
    )
  }

  const weatherConfig = selectedWeather ? WEATHER_CONFIG[selectedWeather] : null

  return (
    <View className='recommend'>
      {/* 顶部信息 */}
      <View className='recommend__header'>
        <Text className='recommend__title'>🎯 为您推荐</Text>
        {weatherConfig && (
          <View className='recommend__weather-info'>
            <Text className='recommend__weather-emoji'>{weatherConfig.emoji}</Text>
            <Text className='recommend__weather-text'>{weatherConfig.label}</Text>
          </View>
        )}
        {selectedWeather && (
          <Text className='recommend__hint'>{getWeatherSceneHint(selectedWeather)}</Text>
        )}
      </View>

      {/* 推荐卡片列表 */}
      <View className='recommend__list'>
        {results.map((result, index) => (
          <PlanCard
            key={result.venue.id}
            result={result}
            rank={index + 1}
            weather={selectedWeather!}
            onAddCompare={() => handleAddCompare(result.venue.id)}
          />
        ))}
      </View>

      {/* 天气备选方案 */}
      {weatherAlternative && selectedWeather !== 'sunny' && (
        <View className='recommend__alternative'>
          <Text className='recommend__alternative-title'>☔ 天气备选方案</Text>
          <View className='recommend__alternative-card'>
            <Text className='recommend__alternative-name'>{weatherAlternative.name}</Text>
            <Text className='recommend__alternative-desc'>
              {weatherAlternative.reviews.summary}
            </Text>
          </View>
        </View>
      )}

      {/* 对比入口 */}
      {compareList.length >= 2 && (
        <View className='recommend__compare-bar safe-area-bottom'>
          <View className='recommend__compare-info'>
            <Text className='recommend__compare-count'>
              已选 {compareList.length} 个方案
            </Text>
          </View>
          <View className='recommend__compare-btn' onClick={handleGoCompare}>
            <Text className='recommend__compare-btn-text'>开始对比 →</Text>
          </View>
        </View>
      )}
    </View>
  )
}
