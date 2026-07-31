import { Module } from '@nestjs/common';

import { ReportsController } from './controllers/report.controller';

import { ReportsService } from './services/report.service';

import { PrismaService } from '../../core/database/prisma.service';

@Module({
  controllers: [
    ReportsController,
  ],
  providers: [
    ReportsService,
    PrismaService,
  ],
})
export class ReportsModule {}