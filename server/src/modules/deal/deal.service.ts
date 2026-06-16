import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';

@Injectable()
export class DealService {
  private readonly logger = new Logger(DealService.name);

  constructor(
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
  ) {}

  /**
   * 获取某场所的比价信息
   */
  async getDealsByVenue(venueId: string): Promise<Deal[]> {
    const deals = await this.dealRepo.find({
      where: { venue: { id: venueId }, isActive: true },
      order: { price: 'ASC' },
    });
    return deals;
  }

  /**
   * 获取所有优惠最低的场所（薅羊毛榜单）
   */
  async getBestDeals(limit: number = 10): Promise<Deal[]> {
    return this.dealRepo.find({
      where: { isActive: true },
      order: { save: 'DESC' },
      take: limit,
      relations: ['venue'],
    });
  }
}
