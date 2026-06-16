import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Venue } from './venue.entity';

@Entity('booking_links')
export class BookingLink {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ length: 30 })
  platform: string;

  @Column({ length: 10 })
  type: string;

  @Column({ length: 200 })
  description: string;

  @Column({ name: 'url', nullable: true, length: 500 })
  url: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Venue, (v) => v.bookingLinks, { onDelete: 'CASCADE' })
  venue: Venue;
}
