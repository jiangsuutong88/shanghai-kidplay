import { View, Text } from '@tarojs/components'
import type { BudgetLevel } from '../../types'
import { BUDGET_LEVELS } from '../../constants/budgetLevels'
import './index.scss'

interface BudgetSelectorProps {
  selected: BudgetLevel | null
  onSelect: (budget: BudgetLevel) => void
}

export default function BudgetSelector({ selected, onSelect }: BudgetSelectorProps) {
  return (
    <View className='budget-selector'>
      <View className='budget-selector__title'>
        <Text className='budget-selector__title-text'>选择预算档位</Text>
        <Text className='budget-selector__subtitle'>一大一小预估费用</Text>
      </View>
      <View className='budget-selector__options'>
        {BUDGET_LEVELS.map((budget) => {
          const isSelected = selected?.label === budget.label
          return (
            <View
              key={budget.label}
              className={`budget-selector__option ${isSelected ? 'budget-selector__option--selected' : ''}`}
              onClick={() => onSelect(budget)}
            >
              <Text className='budget-selector__emoji'>{budget.emoji}</Text>
              <Text className={`budget-selector__label ${isSelected ? 'budget-selector__label--selected' : ''}`}>
                {budget.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
