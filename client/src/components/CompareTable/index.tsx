import { View, Text } from '@tarojs/components'
import type { Venue } from '../../types'
import { formatCost } from '../../utils/format'
import { formatAgeRange } from '../../utils/format'
import './index.scss'

interface CompareTableProps {
  venues: Venue[]
}

/** 对比维度配置 */
const DIMENSIONS = [
  {
    key: 'compositeScore',
    label: '综合评分',
    getValue: (v: Venue) => v.compositeScore.toFixed(1),
  },
  {
    key: 'avgCost',
    label: '费用',
    getValue: (v: Venue) => formatCost(v.avgCost),
  },
  {
    key: 'distance',
    label: '距市中心',
    getValue: (v: Venue) => `约${v.transportInfo.drivingMinutes}分钟`,
  },
  {
    key: 'ageRange',
    label: '适合年龄',
    getValue: (v: Venue) => formatAgeRange(v.minAgeMonths, v.maxAgeMonths),
  },
  {
    key: 'weather',
    label: '天气适配',
    getValue: (v: Venue) => v.weatherSuitability.map((w) => {
      const map = { sunny: '晴天', rainy: '雨天', cloudy: '多云', hot: '高温', cold: '寒冷' }
      return map[w] || w
    }).join('、'),
  },
  {
    key: 'transport',
    label: '交通便利度',
    getValue: (v: Venue) => v.transportInfo.metro || '需驾车',
  },
  {
    key: 'eduValues',
    label: '早教价值',
    getValue: (v: Venue) => v.tags.eduValues.slice(0, 2).join('、'),
  },
]

export default function CompareTable({ venues }: CompareTableProps) {
  if (venues.length === 0) {
    return (
      <View className='compare-table__empty'>
        <Text className='compare-table__empty-text'>请添加方案进行对比</Text>
      </View>
    )
  }

  return (
    <View className='compare-table'>
      {/* 表头 - 方案名称 */}
      <View className='compare-table__header'>
        <View className='compare-table__header-label'>
          <Text className='compare-table__header-text'>对比维度</Text>
        </View>
        {venues.map((venue) => (
          <View key={venue.id} className='compare-table__header-venue'>
            <Text className='compare-table__venue-name'>{venue.name}</Text>
          </View>
        ))}
      </View>

      {/* 对比行 */}
      {DIMENSIONS.map((dim, index) => (
        <View
          key={dim.key}
          className={`compare-table__row ${index % 2 === 0 ? 'compare-table__row--even' : ''}`}
        >
          <View className='compare-table__row-label'>
            <Text className='compare-table__row-label-text'>{dim.label}</Text>
          </View>
          {venues.map((venue) => (
            <View key={venue.id} className='compare-table__row-value'>
              <Text className='compare-table__row-value-text'>
                {dim.getValue(venue)}
              </Text>
            </View>
          ))}
        </View>
      ))}

      {/* 优劣势分析 */}
      <View className='compare-table__analysis'>
        <Text className='compare-table__analysis-title'>优劣势分析</Text>
        {venues.map((venue) => (
          <View key={venue.id} className='compare-table__analysis-card'>
            <Text className='compare-table__analysis-name'>{venue.name}</Text>
            <View className='compare-table__pros'>
              {venue.pros.map((pro, i) => (
                <View key={i} className='compare-table__pro-item'>
                  <Text className='compare-table__pro-text'>✅ {pro}</Text>
                </View>
              ))}
            </View>
            <View className='compare-table__cons'>
              {venue.cons.map((con, i) => (
                <View key={i} className='compare-table__con-item'>
                  <Text className='compare-table__con-text'>⚠️ {con}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
