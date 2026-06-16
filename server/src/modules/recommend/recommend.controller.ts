import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { RecommendQueryDto } from './dto/recommend-query.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('api/v1/recommend')
@UseInterceptors(TransformInterceptor)
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  /**
   * GET /api/v1/recommend/top3
   * 核心：Top3 推荐接口
   */
  @Get('top3')
  async getTop3(@Query() query: RecommendQueryDto) {
    return this.recommendService.getTop3(query);
  }
}
