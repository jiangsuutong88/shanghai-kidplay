import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Venue } from '../../venue/entities/venue.entity';

@Entity('visit_records')
export class VisitRecord {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ name: 'user_id', length: 100 })
  userId: string;

  @Column({ name: 'venue_id' })
  venueId: string;

  @Column({ name: 'visited_at', type: 'date' })
  visitedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  venue: Venue;
}
