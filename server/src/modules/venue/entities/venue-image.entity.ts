import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Venue } from './venue.entity';

@Entity('venue_images')
export class VenueImage {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'is_cover', default: false })
  isCover: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'label', nullable: true, length: 50 })
  label: string;

  @ManyToOne(() => Venue, (v) => v.images, { onDelete: 'CASCADE' })
  venue: Venue;
}
