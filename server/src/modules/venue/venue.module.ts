import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { Venue } from './entities/venue.entity';
import { VenueImage } from './entities/venue-image.entity';
import { BookingLink } from './entities/booking-link.entity';
import { Deal } from '../deal/entities/deal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venue, VenueImage, BookingLink, Deal]),
  ],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
