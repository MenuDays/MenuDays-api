import { Module } from '@nestjs/common';

import { PromotionController } from './controllers/promotion.controller';
import { PromotionService } from './services/promotion.service';

import { PrismaModule } from '../../core/database/prisma.module';
import { CloudinaryModule } from '../../core/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}