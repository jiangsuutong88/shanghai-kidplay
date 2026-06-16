import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { VisitService, VisitDto } from './visit.service';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('api/v1/visits')
@UseInterceptors(TransformInterceptor)
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  /**
   * POST /api/v1/visits
   * 标记已去过
   */
  @Post()
  async markVisited(@Body() dto: VisitDto) {
    return this.visitService.markVisited(dto);
  }

  /**
   * DELETE /api/v1/visits/:venueId
   * 取消标记
   */
  @Delete(':venueId')
  async unmarkVisited(
    @Query('userId') userId: string,
    @Param('venueId') venueId: string,
  ) {
    const deleted = await this.visitService.unmarkVisited(userId, venueId);
    return { deleted };
  }

  /**
   * GET /api/v1/visits
   * 获取足迹列表
   */
  @Get()
  async getUserVisits(
    @Query('userId') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.visitService.getUserVisits(
      userId,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }
}
