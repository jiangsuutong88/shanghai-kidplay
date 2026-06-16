import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { DealService } from './deal.service';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('api/v1/deals')
@UseInterceptors(TransformInterceptor)
export class DealController {
  constructor(private readonly dealService: DealService) {}

  /**
   * GET /api/v1/deals/venue/:venueId
   * 获取某场所的比价信息
   */
  @Get('venue/:venueId')
  async getDealsByVenue(@Param('venueId') venueId: string) {
    return this.dealService.getDealsByVenue(venueId);
  }

  /**
   * GET /api/v1/deals/best
   * 薅羊毛榜单（省钱最多）
   */
  @Get('best')
  async getBestDeals(@Query('limit') limit?: string) {
    return this.dealService.getBestDeals(limit ? parseInt(limit, 10) : 10);
  }
}
