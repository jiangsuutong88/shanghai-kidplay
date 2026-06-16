import { View, Text } from '@tarojs/components'
import './index.scss'

interface TagBadgeProps {
  label: string
  type?: 'edu' | 'feature' | 'weather' | 'default'
}

export default function TagBadge({ label, type = 'default' }: TagBadgeProps) {
  return (
    <View className={`tag-badge tag-badge--${type}`}>
      <Text className={`tag-badge__text tag-badge__text--${type}`}>{label}</Text>
    </View>
  )
}
