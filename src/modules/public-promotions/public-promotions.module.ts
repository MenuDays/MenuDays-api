import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { ExploreModule } from '../explore/explore.module';

import { PublicPromotionController } from './controllers/public-promotion.controller';
import { PublicPromotionService } from './services/public-promotion.service';

@Module({
  imports: [PrismaModule, ExploreModule],
  controllers: [PublicPromotionController],
  providers: [PublicPromotionService],
  exports: [PublicPromotionService],
})
export class PublicPromotionsModule {}