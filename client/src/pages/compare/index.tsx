import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRecommendStore } from '../../stores/useRecommendStore'
import CompareTable from '../../components/CompareTable'
import EmptyState from '../../components/EmptyState'
import './index.scss'

export default function Compare() {
  const { compareList, removeFromCompare } = useRecommendStore()

  const handleRemove = (venueId: string) => {
    removeFromCompare(venueId)
    Taro.showToast({
      title: '已移除',
      icon: 'success',
      duration: 1000,
    })
  }

  const handleShare = () => {
    // 调用微信分享
    Taro.showShareMenu({
      withShareTicket: true,
    })
    Taro.showToast({
      title: '请点击右上角分享给家人',
      icon: 'none',
      duration: 2000,
    })
  }

  if (compareList.length < 2) {
    return (
      <View className='compare'>
        <EmptyState
          title='对比方案不足'
          subtitle='请返回添加至少2个方案进行对比'
          icon='⚖️'
        />
      </View>
    )
  }

  return (
    <View className='compare'>
      {/* 顶部标题 */}
      <View className='compare__header'>
        <Text className='compare__title'>⚖️ 方案对比</Text>
        <Text className='compare__subtitle'>
          已选 {compareList.length} 个方案
        </Text>
      </View>

      {/* 对比表格 */}
      <View className='compare__table'>
        <CompareTable venues={compareList} />
      </View>

      {/* 操作提示 */}
      <View className='compare__actions'>
        <Text className='compare__tip'>
          💡 点击方案可查看详情，长按可移除对比
        </Text>
      </View>

      {/* 方案快捷卡片 */}
      <View className='compare__cards'>
        {compareList.map((venue) => (
          <View key={venue.id} className='compare__card'>
            <View className='compare__card-info' onClick={() => {
              Taro.navigateTo({
                url: `/pages/detail/index?id=${venue.id}`,
              })
            }}>
              <Text className='compare__card-name'>{venue.name}</Text>
              <Text className='compare__card-district'>{venue.district} · {venue.isIndoor ? '室内' : '户外'}</Text>
            </View>
            <View className='compare__card-remove' onClick={() => handleRemove(venue.id)}>
              <Text className='compare__card-remove-text'>移除</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 分享按钮 */}
      <View className='compare__share safe-area-bottom'>
        <View className='compare__share-btn' onClick={handleShare}>
          <Text className='compare__share-btn-text'>📤 分享到家庭群</Text>
        </View>
      </View>
    </View>
  )
}
