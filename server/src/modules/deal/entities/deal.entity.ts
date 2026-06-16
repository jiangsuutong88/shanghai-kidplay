import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Venue } from '../../venue/entities/venue.entity';

@Entity('deals')
export class Deal {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ length: 30 })
  platform: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  save: number;

  @Column({ name: 'deal_url', nullable: true, length: 500 })
  dealUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Venue, (v) => v.deals, { onDelete: 'CASCADE' })
  venue: Venue;
}
