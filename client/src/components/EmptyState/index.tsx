import { View, Text } from '@tarojs/components'
import './index.scss'

interface EmptyStateProps {
  title?: string
  subtitle?: string
  icon?: string
}

export default function EmptyState({
  title = '暂无数据',
  subtitle = '',
  icon = '🔍',
}: EmptyStateProps) {
  return (
    <View className='empty-state'>
      <Text className='empty-state__icon'>{icon}</Text>
      <Text className='empty-state__title'>{title}</Text>
      {subtitle && <Text className='empty-state__subtitle'>{subtitle}</Text>}
    </View>
  )
}
