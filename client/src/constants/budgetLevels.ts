import type { BudgetLevel } from '../types'

/** 预算档位配置 */
export const BUDGET_LEVELS: BudgetLevel[] = [
  {
    label: '0-100元',
    minCost: 0,
    maxCost: 100,
    emoji: '💚',
    color: '#34D399',
  },
  {
    label: '100-200元',
    minCost: 100,
    maxCost: 200,
    emoji: '💛',
    color: '#FBBF24',
  },
  {
    label: '200元以上',
    minCost: 200,
    maxCost: 99999,
    emoji: '🧡',
    color: '#FB923C',
  },
]

/** 根据费用获取预算档位 */
export function getBudgetLevelByCost(cost: number): BudgetLevel | undefined {
  return BUDGET_LEVELS.find((b) => cost >= b.minCost && cost < b.maxCost)
}

/** 格式化费用 */
export function formatCost(cost: number): string {
  if (cost === 0) return '免费'
  return `¥${cost}/组`
}
