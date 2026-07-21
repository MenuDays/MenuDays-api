import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { CloudinaryModule } from '../../core/integrations/cloudinary/cloudinary.module';

import { RestaurantRequestsController } from './controllers/restaurant-requests.controller';
import { RestaurantRequestsService } from './services/restaurant-requests.service';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [RestaurantRequestsController],
  providers: [RestaurantRequestsService],
  exports: [RestaurantRequestsService],
})
export class RestaurantRequestsModule {}  