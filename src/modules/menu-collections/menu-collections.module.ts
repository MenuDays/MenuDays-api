import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { MenuCollectionController } from './controllers/menu-collection.controller';
import { MenuCollectionService } from './services/menu-collection.service';

@Module({
  imports: [PrismaModule],
  controllers: [MenuCollectionController],
  providers: [MenuCollectionService],
  exports: [MenuCollectionService],
})
export class MenuCollectionsModule {}
