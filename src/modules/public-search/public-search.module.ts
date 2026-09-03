import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { ExploreModule } from '../explore/explore.module';
import { PublicDishesModule } from '../public-dishes/public-dishes.module';
import { PublicMenusModule } from '../public-menus/public-menus.module';
import { PublicPromotionsModule } from '../public-promotions/public-promotions.module';
import { PublicSearchController } from './controllers/public-search.controller';
import { PublicSearchService } from './services/public-search.service';

@Module({
  imports: [
    PrismaModule,
    ExploreModule,
    PublicMenusModule,
    PublicDishesModule,
    PublicPromotionsModule,
  ],
  controllers: [PublicSearchController],
  providers: [PublicSearchService],
})
export class PublicSearchModule {}
