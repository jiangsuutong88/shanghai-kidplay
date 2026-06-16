import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { VenueImage } from './entities/venue-image.entity';
import { BookingLink } from './entities/booking-link.entity';
import { Deal } from '../deal/entities/deal.entity';
import { QueryVenueDto } from './dto/query-venue.dto';
import { PaginatedResponseDto } from '../../common/dto/api-response';

@Injectable()
export class VenueService {
  private readonly logger = new Logger(VenueService.name);

  constructor(
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,
    @InjectRepository(VenueImage)
    private readonly imageRepo: Repository<VenueImage>,
    @InjectRepository(BookingLink)
    private readonly bookingLinkRepo: Repository<BookingLink>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
  ) {}

  /**
   * 场所列表（分页 + 筛选）
   */
  async findAll(query: QueryVenueDto): Promise<PaginatedResponseDto<Venue>> {
    const {
      page = 1,
      pageSize = 10,
      district,
      venueType,
      minAgeMonths,
      maxAgeMonths,
      keyword,
      minCost,
      maxCost,
      isIndoor,
      longitude,
      latitude,
      sortBy,
      tag,
    } = query;

    const qb: SelectQueryBuilder<Venue> = this.venueRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.images', 'img')
      .leftJoinAndSelect('v.bookingLinks', 'bl')
      .leftJoinAndSelect('v.deals', 'deal')
      .leftJoinAndSelect('v.tags', 'tag');

    // 行政区筛选
    if (district) {
      qb.andWhere('v.district = :district', { district });
    }

    // 场所类型筛选
    if (venueType) {
      qb.andWhere('v.venue_type = :venueType', { venueType });
    }

    // 年龄筛选
    if (minAgeMonths !== undefined) {
      qb.andWhere('v.max_age_months >= :minAge', { minAge: minAgeMonths });
    }
    if (maxAgeMonths !== undefined) {
      qb.andWhere('v.min_age_months <= :maxAge', { maxAge: maxAgeMonths });
    }

    // 关键词搜索
    if (keyword) {
      qb.andWhere('(v.name LIKE :kw OR v.address LIKE :kw)', {
        kw: `%${keyword}%`,
      });
    }

    // 预算筛选
    if (minCost !== undefined) {
      qb.andWhere('v.avg_cost >= :minCost', { minCost });
    }
    if (maxCost !== undefined) {
      qb.andWhere('v.avg_cost <= :maxCost', { maxCost });
    }

    // 室内/户外
    if (isIndoor !== undefined) {
      qb.andWhere('v.is_indoor = :isIndoor', { isIndoor });
    }

    // 标签筛选
    if (tag) {
      qb.andWhere('tag.name = :tagName', { tagName: tag });
    }

    // 排序
    if (sortBy === 'score') {
      qb.orderBy('v.composite_score', 'DESC');
    } else if (sortBy === 'cost') {
      qb.orderBy('v.avg_cost', 'ASC');
    } else if (sortBy === 'newest') {
      qb.orderBy('v.is_new', 'DESC').addOrderBy('v.created_at', 'DESC');
    } else if (sortBy === 'distance' && longitude && latitude) {
      // PostgreSQL 地理距离计算（简化版，使用 Haversine 公式的近似）
      qb.orderBy(
        `(
          6371 * acos(
            least(1, cos(radians(${latitude})) * cos(radians(CAST(v.latitude AS FLOAT)))
            * cos(radians(CAST(v.longitude AS FLOAT)) - radians(${longitude}))
            + sin(radians(${latitude})) * sin(radians(CAST(v.latitude AS FLOAT))))
          )
        )`,
        'ASC',
      );
    } else {
      qb.orderBy('v.composite_score', 'DESC');
    }

    // 分页
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(items, total, page, pageSize);
  }

  /**
   * 场所详情（含 deals + bookingLinks + images）
   */
  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepo.findOne({
      where: { id },
      relations: ['images', 'bookingLinks', 'deals', 'tags'],
      order: {
        images: { sortOrder: 'ASC' },
      },
    });

    if (!venue) {
      throw new NotFoundException(`场所 ${id} 不存在`);
    }

    return venue;
  }

  /**
   * 计算用户位置到场所的距离（km）
   */
  calculateDistance(
    userLng: number,
    userLat: number,
    venueLng: number,
    venueLat: number,
  ): number {
    const R = 6371; // 地球半径 (km)
    const dLat = this.toRad(venueLat - userLat);
    const dLng = this.toRad(venueLng - userLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(userLat)) *
        Math.cos(this.toRad(venueLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 保留1位小数
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * 根据ID列表获取场所（供推荐服务使用）
   */
  async findByIds(ids: string[]): Promise<Venue[]> {
    return this.venueRepo.findByIds(ids);
  }

  /**
   * 获取所有场所（供推荐服务使用，不含关联）
   */
  async findAllForRecommend(): Promise<Venue[]> {
    return this.venueRepo.find({
      relations: ['tags'],
    });
  }
}
