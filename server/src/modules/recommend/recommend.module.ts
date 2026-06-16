import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { Venue } from '../venue/entities/venue.entity';
import { VisitRecord } from '../visit/entities/visit-record.entity';
import { VenueModule } from '../venue/venue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venue, VisitRecord]),
    VenueModule,
  ],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [RecommendService],
})
export class RecommendModule {}
