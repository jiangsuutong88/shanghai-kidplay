import { View, Text } from '@tarojs/components'
import type { BookingLink } from '../../types'
import Taro from '@tarojs/taro'
import './index.scss'

interface BookingButtonProps {
  links: BookingLink[]
}

export default function BookingButton({ links }: BookingButtonProps) {
  if (!links || links.length === 0) return null

  const handleClick = (link: BookingLink) => {
    if (link.type === 'phone') {
      Taro.makePhoneCall({
        phoneNumber: link.url.replace('tel:', ''),
      })
    } else if (link.type === 'gzh') {
      // 官方公众号：复制公众号名称，提示用户在微信搜索
      Taro.setClipboardData({
        data: link.platform,
      })
      Taro.showToast({
        title: '公众号名称已复制，请在微信搜索关注',
        icon: 'none',
        duration: 2500,
      })
    } else if (link.type === 'mp') {
      // 微信小程序：复制链接，提示用户在微信搜索
      Taro.setClipboardData({
        data: link.platform,
      })
      Taro.showToast({
        title: '小程序名称已复制，请在微信搜索',
        icon: 'none',
        duration: 2500,
      })
    } else {
      // 体验版不使用 webview 页面，直接复制链接到剪贴板
      Taro.setClipboardData({
        data: link.url,
      })
      Taro.showToast({
        title: '链接已复制',
        icon: 'success',
      })
    }
  }

  const getIcon = (type: string): string => {
    switch (type) {
      case 'miniapp': return '📱'
      case 'mp': return '📱'
      case 'gzh': return '📢'
      case 'h5': return '🌐'
      case 'phone': return '📞'
      default: return '🔗'
    }
  }

  return (
    <View className='booking-button'>
      <Text className='booking-button__title'>预约渠道</Text>
      <View className='booking-button__list'>
        {links.map((link, index) => (
          <View
            key={index}
            className='booking-button__item'
            onClick={() => handleClick(link)}
          >
            <Text className='booking-button__icon'>{getIcon(link.type)}</Text>
            <Text className='booking-button__label'>{link.platform}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
