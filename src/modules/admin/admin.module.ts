import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { RestaurantRequestsAdminController } from './controllers/restaurant-requests-admin.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { RestaurantsAdminController } from './controllers/restaurants-admin.controller';

import { RestaurantRequestsAdminService } from './services/restaurant-requests-admin.service';
import { DashboardService } from './services/dashboard.service';
import { RestaurantsAdminService } from './services/restaurants-admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    RestaurantRequestsAdminController,
    DashboardController,
    RestaurantsAdminController,
  ],
  providers: [
    RestaurantRequestsAdminService,
    DashboardService,
    RestaurantsAdminService,
  ],
  exports: [
    RestaurantRequestsAdminService,
    DashboardService,
    RestaurantsAdminService,
  ],
})
export class AdminModule {}
