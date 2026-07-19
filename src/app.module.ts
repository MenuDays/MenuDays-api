import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocationsModule } from './modules/locations/locations.module';
import { CloudinaryModule } from './core/integrations/cloudinary/cloudinary.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    LocationsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
