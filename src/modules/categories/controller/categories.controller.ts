import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from '../services/categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  /**
   * Obtener todas las categorías disponibles.
   *
   * Devuelve únicamente las categorías
   * activas del sistema para que puedan
   * ser utilizadas por el frontend en la
   * exploración y filtrado de platos.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las categorías',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de categorías obtenido correctamente.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  findAll() {
    return this.categoriesService.findAll();
  }
}