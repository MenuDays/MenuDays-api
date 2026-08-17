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
import { RestaurantModule } from './modules/restaurants/restaurants.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { MenusModule } from './modules/menus/menus.module';
import { MenuCollectionsModule } from './modules/menu-collections/menu-collections.module';
import { PromotionModule } from './modules/promotions/promotions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DishesModule } from './modules/dishes/dishes.module';
import { ExploreModule } from './modules/explore/explore.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RestaurantPublicModule } from './modules/public-restaurants/restaurant-public.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PublicMenusModule } from './modules/public-menus/public-menus.module';
import { PublicDishesModule } from './modules/public-dishes/public-dishes.module';
import { PublicPromotionsModule } from './modules/public-promotions/public-promotions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    AdminModule,
    AuthModule,
    LocationsModule,
    UsersModule,
    RestaurantRequestsModule,
    RestaurantModule,
    GalleryModule,
    MenusModule,
    MenuCollectionsModule,
    PromotionModule,
    CategoriesModule,
    DishesModule,
    ExploreModule,
    FavoritesModule,
    ReviewsModule,
    ReportsModule,
    RestaurantPublicModule,
    OrdersModule,
    PublicMenusModule,
    PublicDishesModule,
    PublicPromotionsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
