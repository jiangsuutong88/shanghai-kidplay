import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { VisitRecord } from './entities/visit-record.entity';
import { Venue } from '../venue/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitRecord, Venue])],
  controllers: [VisitController],
  providers: [VisitService],
  exports: [VisitService],
})
export class VisitModule {}
