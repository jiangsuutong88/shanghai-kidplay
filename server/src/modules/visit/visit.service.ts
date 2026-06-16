import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitRecord } from './entities/visit-record.entity';

export interface VisitDto {
  userId: string;
  venueId: string;
  visitedAt?: string; // ISO date string, 默认今天
}

@Injectable()
export class VisitService {
  private readonly logger = new Logger(VisitService.name);

  constructor(
    @InjectRepository(VisitRecord)
    private readonly visitRepo: Repository<VisitRecord>,
  ) {}

  /**
   * 标记已去过
   */
  async markVisited(dto: VisitDto): Promise<VisitRecord> {
    // 检查是否已存在
    const existing = await this.visitRepo.findOne({
      where: {
        userId: dto.userId,
        venueId: dto.venueId,
      },
    });

    if (existing) {
      // 已存在则更新日期
      existing.visitedAt = dto.visitedAt
        ? new Date(dto.visitedAt)
        : new Date();
      return this.visitRepo.save(existing);
    }

    const record = this.visitRepo.create({
      userId: dto.userId,
      venueId: dto.venueId,
      visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : new Date(),
    });
    return this.visitRepo.save(record);
  }

  /**
   * 取消标记
   */
  async unmarkVisited(userId: string, venueId: string): Promise<boolean> {
    const result = await this.visitRepo.delete({
      userId,
      venueId,
    });
    return (result.affected ?? 0) > 0;
  }

  /**
   * 获取用户足迹列表
   */
  async getUserVisits(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{ items: VisitRecord[]; total: number }> {
    const [items, total] = await this.visitRepo.findAndCount({
      where: { userId },
      relations: ['venue'],
      order: { visitedAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total };
  }

  /**
   * 获取用户去过的场所ID列表（供推荐服务使用）
   */
  async getVisitedVenueIds(userId: string): Promise<string[]> {
    const records = await this.visitRepo.find({
      where: { userId },
      select: ['venueId'],
    });
    return records.map((r) => r.venueId);
  }
}
