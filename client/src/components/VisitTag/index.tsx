import { View, Text } from '@tarojs/components'
import type { Venue } from '../../types'
import './index.scss'

interface VisitTagProps {
  /** 已去过的场所列表 */
  visitedVenues: Venue[]
  /** 点击标签移除回调 */
  onRemove: (venueId: string) => void
  /** 点击场所跳转回调 */
  onTap: (venueId: string) => void
}

export default function VisitTag({ visitedVenues, onRemove, onTap }: VisitTagProps) {
  if (!visitedVenues || visitedVenues.length === 0) return null

  return (
    <View className='visit-tag'>
      <Text className='visit-tag__title'>👣 我的遛娃足迹</Text>
      <Text className='visit-tag__count'>已去过 {visitedVenues.length} 个场所</Text>

      <View className='visit-tag__list'>
        {visitedVenues.map((venue) => (
          <View key={venue.id} className='visit-tag__item'>
            <View className='visit-tag__content' onClick={() => onTap(venue.id)}>
              <Text className='visit-tag__name'>{venue.name}</Text>
            </View>
            <View className='visit-tag__remove' onClick={() => onRemove(venue.id)}>
              <Text className='visit-tag__remove-text'>✕</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
