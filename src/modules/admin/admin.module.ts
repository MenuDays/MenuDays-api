import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { RestaurantRequestsAdminController } from './controllers/restaurant-requests-admin.controller';
import { DashboardController } from './controllers/dashboard.controller';

import { RestaurantRequestsAdminService } from './services/restaurant-requests-admin.service';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    RestaurantRequestsAdminController,
    DashboardController,
  ],
  providers: [
    RestaurantRequestsAdminService,
    DashboardService,
  ],
  exports: [
    RestaurantRequestsAdminService,
    DashboardService,
  ],
})
export class AdminModule {}