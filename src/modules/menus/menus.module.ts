import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { CloudinaryModule } from '../../core/integrations/cloudinary/cloudinary.module';

import { MenuController } from './controllers/menu.controller';
import { MenuService } from './services/menu.service';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenusModule {}