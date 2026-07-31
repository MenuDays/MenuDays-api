import { Module } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';

import { ReviewsController } from './controllers/review.controller';
import { ReviewsService } from './services/review.service';

@Module({
  controllers: [
    ReviewsController,
  ],
  providers: [
    ReviewsService,
    PrismaService,
  ],
})
export class ReviewsModule {}