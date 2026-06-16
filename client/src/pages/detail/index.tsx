import { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useRecommendStore } from '../../stores/useRecommendStore'
import { useVisitStore } from '../../stores/useVisitStore'
import { getVenueById } from '../../data/venues'
import VenueInfo from '../../components/VenueInfo'
import ReviewList from '../../components/ReviewList'
import BookingButton from '../../components/BookingButton'
import DealCard from '../../components/DealCard'
import TagBadge from '../../components/TagBadge'
import EmptyState from '../../components/EmptyState'
import type { Venue } from '../../types'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const [venue, setVenue] = useState<Venue | null>(null)
  const { addToCompare, compareList } = useRecommendStore()
  const { addVisit, removeVisit, isVisited } = useVisitStore()
  const [isAddedToCompare, setIsAddedToCompare] = useState(false)
  const [isVisitedState, setIsVisitedState] = useState(false)

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const found = getVenueById(id)
      setVenue(found || null)
    }
  }, [router.params.id])

  useEffect(() => {
    if (venue) {
      setIsAddedToCompare(compareList.some((v) => v.id === venue.id))
      setIsVisitedState(isVisited(venue.id))
    }
  }, [venue, compareList])

  const handleAddCompare = () => {
    if (!venue) return
    if (compareList.length >= 3) {
      Taro.showToast({
        title: '对比列表已满（最多3个）',
        icon: 'none',
      })
      return
    }
    addToCompare(venue)
    setIsAddedToCompare(true)
    Taro.showToast({
      title: '已加入对比',
      icon: 'success',
    })
  }

  const handleGoCompare = () => {
    Taro.navigateTo({
      url: '/pages/compare/index',
    })
  }

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
    })
  }

  const handleToggleVisit = () => {
    if (!venue) return
    if (isVisitedState) {
      removeVisit(venue.id)
      setIsVisitedState(false)
      Taro.showToast({
        title: '已取消标记',
        icon: 'none',
      })
    } else {
      addVisit(venue.id)
      setIsVisitedState(true)
      Taro.showToast({
        title: '已标记为去过 👍',
        icon: 'success',
      })
    }
  }

  if (!venue) {
    return (
      <View className='detail'>
        <EmptyState title='场所不存在' subtitle='请返回重试' icon='😔' />
      </View>
    )
  }

  return (
    <View className='detail'>
      {/* 图片轮播 */}
      <View className='detail__swiper'>
        <Swiper
          className='detail__swiper-inner'
          indicatorDots
          indicatorColor='rgba(255,255,255,0.4)'
          indicatorActiveColor='#FFFFFF'
          circular
          autoplay={false}
        >
          {[venue.coverUrl, ...venue.images].map((img, index) => (
            <SwiperItem key={index}>
              <Image
                className='detail__swiper-img'
                src={img}
                mode='aspectFill'
              />
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 名称与评分 */}
      <View className='detail__title-section'>
        <Text className='detail__name'>
          {venue.name}
          {venue.isNew && <Text className='detail__new-badge'> 新</Text>}
        </Text>
        <View className='detail__rating'>
          <Text className='detail__rating-score'>{venue.compositeScore.toFixed(1)}</Text>
          <Text className='detail__rating-label'>综合评分</Text>
        </View>
      </View>

      {/* 快捷标签 */}
      <View className='detail__quick-tags'>
        <TagBadge label={venue.isIndoor ? '🏠 室内' : '🌳 户外'} type='default' />
        <TagBadge label={venue.district} type='feature' />
        {venue.tags.features.slice(0, 2).map((f) => (
          <TagBadge key={f} label={f} type='weather' />
        ))}
      </View>

      {/* 基础信息 + 早教价值 + 交通 */}
      <VenueInfo venue={venue} />

      {/* 薅羊毛比价卡片 */}
      <View className='detail__section'>
        <DealCard deals={venue.deals} officialCost={venue.officialCost} />
      </View>

      {/* 评价区域 */}
      <ReviewList venue={venue} />

      {/* 预约渠道 */}
      <BookingButton links={venue.bookingLinks} />

      {/* 优劣势 */}
      <View className='detail__pros-cons'>
        <View className='detail__pros'>
          <Text className='detail__pros-title'>✅ 优势</Text>
          {venue.pros.map((pro, i) => (
            <View key={i} className='detail__pros-item'>
              <Text className='detail__pros-text'>{pro}</Text>
            </View>
          ))}
        </View>
        <View className='detail__cons'>
          <Text className='detail__cons-title'>⚠️ 注意事项</Text>
          {venue.cons.map((con, i) => (
            <View key={i} className='detail__cons-item'>
              <Text className='detail__cons-text'>{con}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 底部操作区 */}
      <View className='detail__footer safe-area-bottom'>
        <View
          className={`detail__btn-compare ${isAddedToCompare ? 'detail__btn-compare--added' : ''}`}
          onClick={isAddedToCompare ? handleGoCompare : handleAddCompare}
        >
          <Text className='detail__btn-compare-text'>
            {isAddedToCompare ? '查看对比 →' : '+ 加入对比'}
          </Text>
        </View>
        <View
          className={`detail__btn-visit ${isVisitedState ? 'detail__btn-visit--visited' : ''}`}
          onClick={handleToggleVisit}
        >
          <Text className='detail__btn-visit-text'>
            {isVisitedState ? '✅ 已去过' : '📍 标记去过'}
          </Text>
        </View>
        <View className='detail__btn-share' onClick={handleShare}>
          <Text className='detail__btn-share-text'>📤</Text>
        </View>
      </View>
    </View>
  )
}
