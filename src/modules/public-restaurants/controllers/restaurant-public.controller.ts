import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantPublicService } from '../services/restaurant-public.service';

@ApiTags('Public Restaurants')
@Controller('restaurants')
export class RestaurantPublicController {
  constructor(
    private readonly restaurantPublicService: RestaurantPublicService,
  ) {}

  /**
   * Obtener toda la información pública
   * de un restaurante.
   *
   * Devuelve:
   * - Perfil
   * - Horarios
   * - Teléfonos
   * - Redes sociales
   * - Galería
   * - Categorías
   * - Menús
   * - Platos
   * - Promociones
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener la vista pública de un restaurante',
    description:
      'Retorna toda la información pública de un restaurante para ser visualizada por los comensales.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del restaurante',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Información pública del restaurante obtenida correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurante no encontrado.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.restaurantPublicService.findOne(BigInt(id));
  }
}