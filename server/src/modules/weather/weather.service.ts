import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/** 天气描述接口 */
export interface WeatherInfo {
  date: string;
  dayOfWeek: string;
  textDay: string;
  textNight: string;
  tempMax: string;
  tempMin: string;
  humidity: string;
  windDirDay: string;
  windScaleDay: string;
  umbrella: boolean; // 是否需要带伞
  suitability: string; // "sunny" | "cloudy" | "rainy" | "hot" | "cold"
}

/** 上海坐标 */
const SHANGHAI_LOCATION = '101020100'; // 和风天气上海 Location ID

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * 获取周末天气预报
   * 优先从缓存获取，否则调用和风天气 API
   */
  async getWeekendForecast(): Promise<WeatherInfo[]> {
    const apiKey = this.configService.get<string>('qweather.apiKey', '');
    const apiBase = this.configService.get<string>(
      'qweather.apiBase',
      'https://devapi.qweather.com/v7',
    );

    if (!apiKey) {
      this.logger.warn('和风天气 API Key 未配置，返回模拟数据');
      return this.getMockWeekendWeather();
    }

    try {
      // 获取 7 天预报
      const response = await axios.get(`${apiBase}/weather/7d`, {
        params: {
          location: SHANGHAI_LOCATION,
          key: apiKey,
        },
        timeout: 5000,
      });

      if (response.data?.code !== '200') {
        this.logger.warn(
          `和风天气 API 返回错误: ${response.data?.code}, 使用模拟数据`,
        );
        return this.getMockWeekendWeather();
      }

      const daily = response.data.daily || [];
      // 筛选周末
      const weekendDays = this.filterWeekendDays(daily);
      return weekendDays.map((d: Record<string, string>) => this.mapToWeatherInfo(d));
    } catch (error) {
      this.logger.error(
        `获取天气数据失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      return this.getMockWeekendWeather();
    }
  }

  /**
   * 筛选周末日期
   */
  private filterWeekendDays(daily: Record<string, string>[]): Record<string, string>[] {
    const result: Record<string, string>[] = [];
    for (const day of daily) {
      const date = new Date(day.fxDate);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        result.push(day);
      }
    }
    return result;
  }

  /**
   * 映射和风天气数据到内部格式
   */
  private mapToWeatherInfo(day: Record<string, string>): WeatherInfo {
    const date = new Date(day.fxDate);
    const dayOfWeekNum = date.getDay();
    const dayOfWeekMap: Record<number, string> = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
    };

    return {
      date: day.fxDate,
      dayOfWeek: dayOfWeekMap[dayOfWeekNum] || '',
      textDay: day.textDay || '',
      textNight: day.textNight || '',
      tempMax: day.tempMax || '',
      tempMin: day.tempMin || '',
      humidity: day.humidity || '',
      windDirDay: day.windDirDay || '',
      windScaleDay: day.windScaleDay || '',
      umbrella: this.needsUmbrella(day.textDay),
      suitability: this.getWeatherSuitability(day),
    };
  }

  /**
   * 判断是否需要带伞
   */
  private needsUmbrella(textDay: string): boolean {
    const rainKeywords = ['雨', '阵雨', '雷', '暴雨', '小雨', '中雨', '大雨'];
    return rainKeywords.some((kw) => textDay.includes(kw));
  }

  /**
   * 获取天气适合度标签
   */
  private getWeatherSuitability(day: Record<string, string>): string {
    const textDay = day.textDay || '';
    const tempMax = parseInt(day.tempMax, 10) || 25;

    if (textDay.includes('雨')) return 'rainy';
    if (tempMax >= 35) return 'hot';
    if (tempMax <= 5) return 'cold';
    if (textDay.includes('阴') || textDay.includes('多云')) return 'cloudy';
    return 'sunny';
  }

  /**
   * 模拟周末天气数据（开发/测试用）
   */
  private getMockWeekendWeather(): WeatherInfo[] {
    const now = new Date();
    const result: WeatherInfo[] = [];

    // 查找最近两个周末日
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();

      if (dayOfWeek === 6 || dayOfWeek === 0) {
        result.push({
          date: d.toISOString().split('T')[0],
          dayOfWeek: dayOfWeek === 6 ? '周六' : '周日',
          textDay: '晴',
          textNight: '晴',
          tempMax: '32',
          tempMin: '24',
          humidity: '65',
          windDirDay: '东南风',
          windScaleDay: '3',
          umbrella: false,
          suitability: 'sunny',
        });
      }

      if (result.length >= 2) break;
    }

    return result;
  }
}
