import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { FavoritesService } from '../services/favorites.service';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  /**
   * Agregar un restaurante a favoritos.
   */
  @Post(':restaurantId')
  @ApiOperation({
    summary: 'Agregar restaurante a favoritos',
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'ID del restaurante',
    example: 1,
  })
  addFavorite(
    @CurrentUser('id') userId: bigint,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.favoritesService.addFavorite(
      userId,
      BigInt(restaurantId),
    );
  }

  /**
   * Obtener los restaurantes favoritos del usuario.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener favoritos',
  })
  findAll(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.favoritesService.findAll(userId);
  }

  /**
   * Eliminar un restaurante de favoritos.
   */
  @Delete(':restaurantId')
  @ApiOperation({
    summary: 'Eliminar restaurante de favoritos',
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'ID del restaurante',
    example: 1,
  })
  remove(
    @CurrentUser('id') userId: bigint,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.favoritesService.remove(
      userId,
      BigInt(restaurantId),
    );
  }
}