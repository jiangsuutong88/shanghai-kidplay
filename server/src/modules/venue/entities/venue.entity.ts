import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VenueImage } from './venue-image.entity';
import { BookingLink } from './booking-link.entity';
import { Deal } from '../../deal/entities/deal.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity('venues')
export class Venue {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 20 })
  district: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ name: 'min_age_months', default: 0 })
  minAgeMonths: number;

  @Column({ name: 'best_age_months', default: 12 })
  bestAgeMonths: number;

  @Column({ name: 'max_age_months', default: 72 })
  maxAgeMonths: number;

  @Column({ name: 'venue_type', length: 30 })
  venueType: string;

  @Column({ name: 'is_indoor', default: false })
  isIndoor: boolean;

  @Column({ name: 'avg_cost', type: 'decimal', precision: 8, scale: 2 })
  avgCost: number;

  @Column({ name: 'official_cost', type: 'decimal', precision: 8, scale: 2 })
  officialCost: number;

  @Column({
    name: 'dp_rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
  })
  dpRating: number;

  @Column({
    name: 'xhs_hot_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
  })
  xhsHotScore: number;

  @Column({
    name: 'dy_interact_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
  })
  dyInteractScore: number;

  @Column({
    name: 'composite_score',
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 3.0,
  })
  compositeScore: number;

  @Column({ type: 'simple-array' })
  weatherSuitability: string[];

  @Column({ name: 'business_hours', length: 100, nullable: true })
  businessHours: string;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string;

  @Column({ name: 'transport_metro', length: 100, nullable: true })
  transportMetro: string;

  @Column({ name: 'has_parking', default: false })
  hasParking: boolean;

  @Column({ name: 'is_new', default: false })
  isNew: boolean;

  @Column({ name: 'new_month', length: 7, nullable: true })
  newMonth: string;

  @Column({ type: 'simple-array', nullable: true })
  pros: string[];

  @Column({ type: 'simple-array', nullable: true })
  cons: string[];

  @Column({ name: 'age_range', length: 20, nullable: true })
  ageRange: string;

  @Column({ name: 'best_age', length: 20, nullable: true })
  bestAge: string;

  @Column({ name: 'xhs_links', type: 'jsonb', nullable: true })
  xhsLinks: { title: string; likes: string; url: string }[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => VenueImage, (img) => img.venue)
  images: VenueImage[];

  @OneToMany(() => BookingLink, (link) => link.venue)
  bookingLinks: BookingLink[];

  @OneToMany(() => Deal, (deal) => deal.venue)
  deals: Deal[];

  @ManyToMany(() => Tag, (tag) => tag.venues)
  @JoinTable()
  tags: Tag[];
}
