import { Module } from '@nestjs/common';

import { GalleryController } from './controllers/gallery.controller';
import { GalleryService } from './services/gallery.service';

import { PrismaModule } from '../../core/database/prisma.module';
import { CloudinaryModule } from '../../core/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [
    GalleryController,
  ],
  providers: [
    GalleryService,
  ],
  exports: [
    GalleryService,
  ],
})
export class GalleryModule {}