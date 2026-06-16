import { View, Text } from '@tarojs/components'
import type { WeatherType } from '../../types'
import { WEATHER_CONFIG, WEATHER_OPTIONS } from '../../constants/weatherTypes'
import './index.scss'

interface WeatherTagProps {
  selected: WeatherType | null
  onSelect: (weather: WeatherType) => void
  isAutoDetected: boolean
}

export default function WeatherTag({ selected, onSelect, isAutoDetected }: WeatherTagProps) {
  return (
    <View className='weather-tag'>
      <View className='weather-tag__title'>
        <Text className='weather-tag__title-text'>今天天气</Text>
        {isAutoDetected && (
          <Text className='weather-tag__auto-badge'>自动检测</Text>
        )}
      </View>
      <View className='weather-tag__options'>
        {WEATHER_OPTIONS.map((weather) => {
          const config = WEATHER_CONFIG[weather]
          const isSelected = selected === weather
          return (
            <View
              key={weather}
              className={`weather-tag__option ${isSelected ? 'weather-tag__option--selected' : ''}`}
              onClick={() => onSelect(weather)}
            >
              <Text className='weather-tag__emoji'>{config.emoji}</Text>
              <Text className={`weather-tag__label ${isSelected ? 'weather-tag__label--selected' : ''}`}>
                {config.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
