import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { ExploreModule } from '../explore/explore.module';

import { PublicDishController } from './controllers/public-dish.controller';
import { PublicDishService } from './services/public-dish.service';

@Module({
  imports: [PrismaModule, ExploreModule],
  controllers: [PublicDishController],
  providers: [PublicDishService],
  exports: [PublicDishService],
})
export class PublicDishesModule {}