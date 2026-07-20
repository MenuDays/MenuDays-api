import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { RestaurantRequestsAdminController } from './controllers/restaurant-requests-admin.controller';
import { RestaurantRequestsAdminService } from './services/restaurant-requests-admin.service';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    RestaurantRequestsAdminController,
  ],
  providers: [
    RestaurantRequestsAdminService,
  ],
  exports: [
    RestaurantRequestsAdminService,
  ],
})
export class AdminModule {}