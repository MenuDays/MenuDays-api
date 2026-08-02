import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module';
import { RestaurantPublicController } from './controllers/restaurant-public.controller';
import { RestaurantPublicService } from './services/restaurant-public.service';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    RestaurantPublicController,
  ],
  providers: [
    RestaurantPublicService,
  ],
})
export class RestaurantPublicModule {}