import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { ExploreModule } from '../explore/explore.module';
import { PublicMenuController } from './controllers/public-menu.controller';
import { PublicMenuService } from './services/public-menu.service';

@Module({
  imports: [PrismaModule, ExploreModule],
  controllers: [PublicMenuController],
  providers: [PublicMenuService],
})
export class PublicMenusModule {}
