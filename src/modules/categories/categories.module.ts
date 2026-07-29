import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}