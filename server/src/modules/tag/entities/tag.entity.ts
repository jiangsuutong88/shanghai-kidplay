import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { Venue } from '../../venue/entities/venue.entity';

@Entity('tags')
export class Tag {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ length: 30, unique: true })
  name: string;

  @Column({ length: 20 })
  category: string;

  @ManyToMany(() => Venue, (v) => v.tags)
  venues: Venue[];
}
