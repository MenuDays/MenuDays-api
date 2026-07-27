import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantService } from './services/restaurant.service';

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}