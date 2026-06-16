import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { Deal } from './entities/deal.entity';
import { Venue } from '../venue/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Venue])],
  controllers: [DealController],
  providers: [DealService],
  exports: [DealService],
})
export class DealModule {}
