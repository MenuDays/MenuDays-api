import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module';

import { LocationsController } from './controllers/locations.controller';
import { LocationsService } from './services/locations.service';

@Module({
  imports: [PrismaModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}