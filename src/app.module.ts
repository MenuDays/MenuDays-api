import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocationsModule } from './modules/locations/locations.module';
import { CloudinaryModule } from './core/integrations/cloudinary/cloudinary.module';
import { UsersModule } from './modules/users/users.module';
import { RestaurantRequestsModule } from 'src/modules/restaurant-requests/restaurant-requests.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    AdminModule,
    AuthModule,
    LocationsModule,
    UsersModule,
    RestaurantRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
