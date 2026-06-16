import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryVenueDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  venueType?: string;

  @IsOptional()
  @Type(() => Number)
  minAgeMonths?: number;

  @IsOptional()
  @Type(() => Number)
  maxAgeMonths?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  minCost?: number;

  @IsOptional()
  @Type(() => Number)
  maxCost?: number;

  @IsOptional()
  @IsBoolean()
  isIndoor?: boolean;

  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsString()
  sortBy?: string; // 'distance' | 'score' | 'cost' | 'newest'

  @IsOptional()
  @IsString()
  tag?: string;
}
