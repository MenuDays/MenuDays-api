import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';

import { CloudinaryModule } from '../../core/integrations/cloudinary/cloudinary.module';

import { DishController } from './controllers/dish.controller';
import { DishService } from './services/dish.service';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [
    DishController,
  ],
  providers: [
    DishService,
  ],
})
export class DishesModule {}