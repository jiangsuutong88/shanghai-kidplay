import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('api/v1/weather')
@UseInterceptors(TransformInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * GET /api/v1/weather/weekend
   * 周末天气预报
   */
  @Get('weekend')
  async getWeekendForecast() {
    return this.weatherService.getWeekendForecast();
  }
}
