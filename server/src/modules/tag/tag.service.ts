import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  /**
   * 获取所有标签
   */
  async findAll(category?: string): Promise<Tag[]> {
    if (category) {
      return this.tagRepo.find({ where: { category } });
    }
    return this.tagRepo.find();
  }

  /**
   * 按分类获取标签
   */
  async findByCategory(category: string): Promise<Tag[]> {
    return this.tagRepo.find({ where: { category } });
  }
}
