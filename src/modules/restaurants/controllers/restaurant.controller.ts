import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
}