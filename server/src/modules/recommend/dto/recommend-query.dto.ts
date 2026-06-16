import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendQueryDto {
  @IsOptional()
  @IsString()
  ageGroup?: string; // "0-6" | "6-12" | "12-24" | "24-48" | "48-72"

  @IsOptional()
  @IsString()
  budgetLevel?: string; // "free" | "low" | "medium" | "high"

  @IsOptional()
  @IsString()
  weather?: string; // "sunny" | "cloudy" | "rainy" | "hot" | "cold"

  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsString()
  userId?: string; // 微信 openid，用于排除已去过
}
