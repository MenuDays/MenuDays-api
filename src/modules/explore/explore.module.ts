import { Module } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';

import { ExploreController } from './controllers/explore.controller';
import { ExploreService } from './services/explore.service';

@Module({
  controllers: [
    ExploreController,
  ],
  providers: [
    ExploreService,
    PrismaService,
  ],
})
export class ExploreModule {}