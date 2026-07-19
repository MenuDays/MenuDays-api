import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../../core/integrations/cloudinary/cloudinary.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CloudinaryModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}