import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateRestaurantCategoriesDto } from '../dto/update-restaurant-categories.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { RestaurantService } from '../services/restaurant.service';

import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';

@ApiTags('Restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Obtener perfil del restaurante autenticado',
  })
  getProfile(@Request() req: any) {
    return this.restaurantService.getProfile(
      req.user.id,
    );
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Actualizar perfil del restaurante',
  })
  updateProfile(
    @Request() req: any,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateProfile(
      req.user.id,
      updateRestaurantDto,
    );
  }
    @Get('categories')
  @ApiOperation({
    summary:
      'Obtener las categorías seleccionadas por el restaurante',
  })
  getCategories(@Request() req: any) {
    return this.restaurantService.getCategories(
      req.user.id,
    );
  }

  @Put('categories')
  @ApiOperation({
    summary:
      'Reemplazar las categorías del restaurante',
  })
  replaceCategories(
    @Request() req: any,
    @Body()
    updateRestaurantCategoriesDto: UpdateRestaurantCategoriesDto,
  ) {
    return this.restaurantService.replaceCategories(
      req.user.id,
      updateRestaurantCategoriesDto,
    );
  }
}