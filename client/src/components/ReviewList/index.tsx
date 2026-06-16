import { View, Text } from '@tarojs/components'
import type { Venue } from '../../types'
import './index.scss'

interface ReviewListProps {
  venue: Venue
}

export default function ReviewList({ venue }: ReviewListProps) {
  const { reviews } = venue

  return (
    <View className='review-list'>
      {/* 评价摘要 */}
      <View className='review-list__section'>
        <Text className='review-list__section-title'>📝 评价摘要</Text>
        <Text className='review-list__summary'>{reviews.summary}</Text>
      </View>

      {/* 好评关键词 */}
      <View className='review-list__section'>
        <Text className='review-list__section-title'>👍 好评关键词</Text>
        <View className='review-list__keywords'>
          {reviews.prosKeywords.map((keyword) => (
            <View key={keyword} className='review-list__keyword review-list__keyword--pro'>
              <Text className='review-list__keyword-text review-list__keyword-text--pro'>
                {keyword}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 避坑提示 */}
      <View className='review-list__section'>
        <Text className='review-list__section-title'>⚠️ 避坑提示</Text>
        <View className='review-list__keywords'>
          {reviews.consKeywords.map((keyword) => (
            <View key={keyword} className='review-list__keyword review-list__keyword--con'>
              <Text className='review-list__keyword-text review-list__keyword-text--con'>
                {keyword}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 精选评价 */}
      <View className='review-list__section'>
        <Text className='review-list__section-title'>💬 精选评价</Text>
        {reviews.topReviews.map((review, index) => (
          <View key={index} className='review-list__review'>
            <View className='review-list__review-header'>
              <Text className='review-list__review-source'>{review.sourcePlatform}</Text>
              <View className='review-list__review-rating'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    className={`review-list__star ${star <= review.rating ? 'review-list__star--active' : ''}`}
                  >
                    ⭐
                  </Text>
                ))}
              </View>
            </View>
            <Text className='review-list__review-text'>{review.summary}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
