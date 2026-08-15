import { Module } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';

import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

@Module({
  controllers: [
    NotificationsController,
  ],
  providers: [
    NotificationsService,
    PrismaService,
  ],
  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}
