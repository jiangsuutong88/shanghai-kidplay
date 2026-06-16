import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRecommendStore } from '../../stores/useRecommendStore'
import { useVisitStore } from '../../stores/useVisitStore'
import { detectWeather } from '../../utils/weather'
import { getCurrentMonthRecommend } from '../../constants/weatherTypes'
import { getVenuesByIds } from '../../data/venues'
import AgePicker from '../../components/AgePicker'
import WeatherTag from '../../components/WeatherTag'
import BudgetSelector from '../../components/BudgetSelector'
import VisitTag from '../../components/VisitTag'
import type { AgeGroup, BudgetLevel, WeatherType, Venue } from '../../types'
import { getWeatherSceneHint } from '../../constants/weatherTypes'
import './index.scss'

export default function Index() {
  const {
    currentStep,
    selectedAgeGroup,
    selectedWeather,
    isWeatherAutoDetected,
    selectedBudget,
    nextStep,
    selectAgeGroup,
    selectWeather,
    setWeatherAutoDetected,
    selectBudget,
    generateRecommendations,
  } = useRecommendStore()

  const { visitedIds, loadVisits, removeVisit } = useVisitStore()
  const [isDetectingWeather, setIsDetectingWeather] = useState(false)
  const [visitedVenues, setVisitedVenues] = useState<Venue[]>([])

  // 当前月份推荐信息
  const monthRecommend = getCurrentMonthRecommend()

  // 自动检测天气
  useEffect(() => {
    if (currentStep === 2 && !selectedWeather) {
      detectWeatherAuto()
    }
  }, [currentStep])

  // 加载足迹
  useEffect(() => {
    loadVisits()
  }, [])

  // 同步已去过的场所列表
  useEffect(() => {
    if (visitedIds.length > 0) {
      const venues = getVenuesByIds(visitedIds)
      setVisitedVenues(venues)
    } else {
      setVisitedVenues([])
    }
  }, [visitedIds])

  const detectWeatherAuto = async () => {
    setIsDetectingWeather(true)
    try {
      const result = await detectWeather()
      selectWeather(result.weather)
      setWeatherAutoDetected(result.isAutoDetected)
    } catch (err) {
      console.warn('天气检测失败', err)
      selectWeather('sunny')
      setWeatherAutoDetected(false)
    } finally {
      setIsDetectingWeather(false)
    }
  }

  const handleAgeSelect = (ageGroup: AgeGroup) => {
    selectAgeGroup(ageGroup)
    // 自动进入下一步
    setTimeout(() => nextStep(), 300)
  }

  const handleWeatherSelect = (weather: WeatherType) => {
    selectWeather(weather)
    setWeatherAutoDetected(false)
  }

  const handleBudgetSelect = (budget: BudgetLevel) => {
    selectBudget(budget)
  }

  const handleNextStep = () => {
    if (currentStep === 2 && selectedWeather) {
      nextStep()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      useRecommendStore.setState({ currentStep: currentStep - 1 })
    }
  }

  const handleSubmit = () => {
    if (!selectedAgeGroup || !selectedWeather || !selectedBudget) {
      Taro.showToast({
        title: '请先完成所有选择',
        icon: 'none',
      })
      return
    }

    generateRecommendations()

    Taro.navigateTo({
      url: '/pages/recommend/index',
    })
  }

  const handleVisitRemove = (venueId: string) => {
    removeVisit(venueId)
    Taro.showToast({
      title: '已移除',
      icon: 'none',
    })
  }

  const handleVisitTap = (venueId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${venueId}`,
    })
  }

  const canSubmit = selectedAgeGroup && selectedWeather && selectedBudget

  // 步骤配置
  const steps = [
    { num: 1, label: '年龄' },
    { num: 2, label: '天气' },
    { num: 3, label: '预算' },
  ]

  return (
    <View className='home'>
      {/* 顶部标题 */}
      <View className='home__header'>
        <Text className='home__title'>🎈 上海周末遛娃</Text>
        <Text className='home__subtitle'>3步找到最适合的亲子场所</Text>
      </View>

      {/* 月份推荐横幅 */}
      <View className='home__month-banner'>
        <Text className='home__month-emoji'>{monthRecommend.emoji}</Text>
        <View className='home__month-info'>
          <Text className='home__month-title'>{monthRecommend.title}</Text>
          <Text className='home__month-subtitle'>{monthRecommend.subtitle}</Text>
        </View>
      </View>

      {/* 我的遛娃足迹 */}
      <View className='home__visits'>
        <VisitTag
          visitedVenues={visitedVenues}
          onRemove={handleVisitRemove}
          onTap={handleVisitTap}
        />
      </View>

      {/* 步骤指示器 */}
      <View className='home__steps'>
        {steps.map((step, index) => (
          <View key={step.num} className='step-item'>
            <View
              className={`step-dot ${
                currentStep > step.num
                  ? 'step-dot--completed'
                  : currentStep === step.num
                  ? 'step-dot--active'
                  : 'step-dot--waiting'
              }`}
            >
              {currentStep > step.num ? '✓' : step.num}
            </View>
            {index < steps.length - 1 && (
              <View
                className={`step-line ${
                  currentStep > step.num
                    ? 'step-line--completed'
                    : currentStep === step.num
                    ? 'step-line--active'
                    : 'step-line--waiting'
                }`}
              />
            )}
          </View>
        ))}
      </View>

      {/* 步骤内容 */}
      <View className='home__content'>
        {/* Step 1: 年龄选择 */}
        {currentStep === 1 && (
          <View className='home__step'>
            <AgePicker selected={selectedAgeGroup} onSelect={handleAgeSelect} />
          </View>
        )}

        {/* Step 2: 天气选择 */}
        {currentStep === 2 && (
          <View className='home__step'>
            {isDetectingWeather ? (
              <View className='home__loading'>
                <Text className='home__loading-text'>正在获取天气信息...</Text>
              </View>
            ) : (
              <>
                <WeatherTag
                  selected={selectedWeather}
                  onSelect={handleWeatherSelect}
                  isAutoDetected={isWeatherAutoDetected}
                />
                {selectedWeather && (
                  <View className='home__weather-hint'>
                    <Text className='home__weather-hint-text'>
                      {getWeatherSceneHint(selectedWeather)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Step 3: 预算选择 */}
        {currentStep === 3 && (
          <View className='home__step'>
            <BudgetSelector selected={selectedBudget} onSelect={handleBudgetSelect} />
          </View>
        )}
      </View>

      {/* 底部操作区 */}
      <View className='home__footer safe-area-bottom'>
        {currentStep > 1 && (
          <View className='home__btn-back btn-large btn-secondary' onClick={handlePrevStep}>
            <Text className='home__btn-back-text'>上一步</Text>
          </View>
        )}

        {currentStep < 3 && selectedAgeGroup && (
          <View className='home__btn-next btn-large btn-primary' onClick={handleNextStep}>
            <Text className='home__btn-next-text'>下一步</Text>
          </View>
        )}

        {currentStep === 3 && (
          <View
            className={`home__btn-submit btn-large ${canSubmit ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleSubmit}
          >
            <Text className='home__btn-submit-text'>
              {canSubmit ? '🎯 查看推荐' : '请完成选择'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
