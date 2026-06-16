import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { TagService } from './tag.service';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('api/v1/tags')
@UseInterceptors(TransformInterceptor)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * GET /api/v1/tags
   * 获取所有标签，可选按分类筛选
   */
  @Get()
  async findAll(@Query('category') category?: string) {
    return this.tagService.findAll(category);
  }
}
