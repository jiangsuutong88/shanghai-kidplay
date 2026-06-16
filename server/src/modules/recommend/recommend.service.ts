import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from '../venue/entities/venue.entity';
import { VisitRecord } from '../visit/entities/visit-record.entity';
import { RecommendQueryDto } from './dto/recommend-query.dto';
import { VenueService } from '../venue/venue.service';

/** 年龄档位映射（单位：月） */
const AGE_GROUPS: Record<string, { min: number; max: number }> = {
  '0-6': { min: 0, max: 6 },
  '6-12': { min: 6, max: 12 },
  '12-24': { min: 12, max: 24 },
  '24-48': { min: 24, max: 48 },
  '48-72': { min: 48, max: 72 },
};

/** 预算档位映射（单位：元） */
const BUDGET_LEVELS: Record<string, { min: number; max: number }> = {
  free: { min: 0, max: 0 },
  low: { min: 1, max: 100 },
  medium: { min: 100, max: 300 },
  high: { min: 300, max: 99999 },
};

interface ScoredVenue extends Venue {
  _score: number;
  _distance: number;
  _visited: boolean;
  _isNewBoost: boolean;
}

@Injectable()
export class RecommendService {
  private readonly logger = new Logger(RecommendService.name);

  constructor(
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,
    @InjectRepository(VisitRecord)
    private readonly visitRepo: Repository<VisitRecord>,
    private readonly venueService: VenueService,
  ) {}

  /**
   * 核心：Top3 推荐算法
   *
   * 1. 年龄过滤
   * 2. 天气过滤
   * 3. 预算过滤
   * 4. 排序：已去过降权 → 新场所优先 → 距离近优先 → 综合评分高优先
   * 5. Top3 差异度选取（不同 venueType、不同 district）
   */
  async getTop3(query: RecommendQueryDto) {
    const {
      ageGroup = '12-24',
      budgetLevel = 'medium',
      weather = 'sunny',
      longitude = 121.4737,
      latitude = 31.2304,
      userId,
    } = query;

    // 1. 年龄 & 预算范围
    const ageRange = AGE_GROUPS[ageGroup] || AGE_GROUPS['12-24'];
    const budgetRange = BUDGET_LEVELS[budgetLevel] || BUDGET_LEVELS['medium'];

    // 2. 查询所有候选场所
    const candidates = await this.venueRepo.find({
      relations: ['tags', 'images', 'deals', 'bookingLinks'],
    });

    // 3. 获取用户已去过列表
    let visitedVenueIds: Set<string> = new Set();
    if (userId) {
      const visits = await this.visitRepo.find({
        where: { userId },
      });
      visitedVenueIds = new Set(visits.map((v) => v.venueId));
    }

    // 4. 过滤
    const filtered = candidates.filter((v) => {
      // 年龄过滤
      if (v.maxAgeMonths < ageRange.min || v.minAgeMonths > ageRange.max) {
        return false;
      }
      // 天气过滤
      if (
        v.weatherSuitability &&
        v.weatherSuitability.length > 0 &&
        !v.weatherSuitability.includes(weather)
      ) {
        return false;
      }
      // 预算过滤
      if (budgetLevel !== 'free' || budgetRange.max === 0) {
        if (budgetRange.max === 0) {
          // 免费档
          if (Number(v.avgCost) > 0) return false;
        } else {
          if (
            Number(v.avgCost) < budgetRange.min ||
            Number(v.avgCost) > budgetRange.max
          ) {
            return false;
          }
        }
      }
      return true;
    });

    // 5. 评分排序
    const scored: ScoredVenue[] = filtered.map((v) => {
      const isVisited = visitedVenueIds.has(v.id);
      const isNewBoost = v.isNew === true;

      // 距离计算
      const distance =
        longitude && latitude
          ? this.venueService.calculateDistance(
              longitude,
              latitude,
              Number(v.longitude),
              Number(v.latitude),
            )
          : 999;

      // 综合评分 = 基础分 + 新场所加分 - 已去过惩罚 + 距离惩罚
      let score = Number(v.compositeScore) || 3.0;

      // 新场所加 1.5 分
      if (isNewBoost) {
        score += 1.5;
      }

      // 已去过降 3.0 分（确保已去过的不容易进 Top3）
      if (isVisited) {
        score -= 3.0;
      }

      // 距离惩罚：每 10km 扣 0.3 分，最高扣 1.5 分
      const distancePenalty = Math.min(distance / 10 * 0.3, 1.5);
      score -= distancePenalty;

      const sv = v as ScoredVenue;
      sv._score = Math.round(score * 100) / 100;
      sv._distance = distance;
      sv._visited = isVisited;
      sv._isNewBoost = isNewBoost;
      return sv;
    });

    // 按评分降序排列
    scored.sort((a, b) => b._score - a._score);

    // 6. Top3 差异度选取（不同 venueType、不同 district）
    const top3: ScoredVenue[] = [];
    const usedVenueTypes = new Set<string>();
    const usedDistricts = new Set<string>();

    for (const sv of scored) {
      if (top3.length >= 3) break;

      // 同 venueType 且 同 district 跳过（差异度保证）
      if (usedVenueTypes.has(sv.venueType) && usedDistricts.has(sv.district)) {
        continue;
      }

      top3.push(sv);
      usedVenueTypes.add(sv.venueType);
      usedDistricts.add(sv.district);
    }

    // 如果差异度选取不足3个，补充剩余高分场所
    if (top3.length < 3) {
      const top3Ids = new Set(top3.map((v) => v.id));
      for (const sv of scored) {
        if (top3.length >= 3) break;
        if (!top3Ids.has(sv.id)) {
          top3.push(sv);
        }
      }
    }

    // 7. 备选（4-6名）
    const top3Ids = new Set(top3.map((v) => v.id));
    const alternatives = scored
      .filter((v) => !top3Ids.has(v.id))
      .slice(0, 3);

    // 8. 构造响应
    return {
      top3: top3.map((v) => this.formatVenueResult(v)),
      alternatives: alternatives.map((v) => this.formatVenueResult(v)),
      meta: {
        ageGroup,
        budgetLevel,
        weather,
        totalCandidates: filtered.length,
        visitedCount: visitedVenueIds.size,
      },
    };
  }

  /**
   * 格式化推荐结果中的场所信息
   */
  private formatVenueResult(sv: ScoredVenue) {
    return {
      id: sv.id,
      name: sv.name,
      address: sv.address,
      district: sv.district,
      venueType: sv.venueType,
      isIndoor: sv.isIndoor,
      coverUrl: sv.coverUrl,
      avgCost: Number(sv.avgCost),
      officialCost: Number(sv.officialCost),
      compositeScore: Number(sv.compositeScore),
      ageRange: sv.ageRange,
      bestAge: sv.bestAge,
      businessHours: sv.businessHours,
      transportMetro: sv.transportMetro,
      hasParking: sv.hasParking,
      isNew: sv.isNew,
      pros: sv.pros,
      cons: sv.cons,
      weatherSuitability: sv.weatherSuitability,
      tags: sv.tags?.map((t) => t.name) || [],
      images: sv.images || [],
      deals: sv.deals?.filter((d) => d.isActive) || [],
      bookingLinks: sv.bookingLinks?.filter((b) => b.isActive) || [],
      // 推荐特有字段
      _score: sv._score,
      _distance: sv._distance,
      _visited: sv._visited,
    };
  }
}
