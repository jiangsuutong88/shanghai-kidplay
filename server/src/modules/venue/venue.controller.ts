import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { QueryVenueDto } from './dto/query-venue.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('api/v1/venues')
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  /**
   * GET /api/v1/venues
   * 场所列表（分页+筛选）
   */
  @Get()
  async findAll(@Query() query: QueryVenueDto) {
    return this.venueService.findAll(query);
  }

  /**
   * GET /api/v1/venues/:id
   * 场所详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.venueService.findOne(id);
  }
}
