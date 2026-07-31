import { Module } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';

import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './services/favorites.service';

@Module({
  controllers: [
    FavoritesController,
  ],
  providers: [
    FavoritesService,
    PrismaService,
  ],
})
export class FavoritesModule {}