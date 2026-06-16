import { View, Text } from '@tarojs/components'
import type { AgeGroup } from '../../types'
import { AGE_GROUPS } from '../../constants/ageGroups'
import './index.scss'

interface AgePickerProps {
  selected: AgeGroup | null
  onSelect: (ageGroup: AgeGroup) => void
}

export default function AgePicker({ selected, onSelect }: AgePickerProps) {
  return (
    <View className='age-picker'>
      <View className='age-picker__title'>
        <Text className='age-picker__title-text'>选择宝宝年龄段</Text>
      </View>
      <View className='age-picker__options'>
        {AGE_GROUPS.map((group) => {
          const isSelected = selected?.label === group.label
          return (
            <View
              key={group.label}
              className={`age-picker__option ${isSelected ? 'age-picker__option--selected' : ''}`}
              onClick={() => onSelect(group)}
            >
              <Text className='age-picker__emoji'>{group.emoji}</Text>
              <Text className={`age-picker__label ${isSelected ? 'age-picker__label--selected' : ''}`}>
                {group.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
