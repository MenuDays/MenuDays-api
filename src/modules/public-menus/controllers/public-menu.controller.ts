import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { FindPublicMenusDto } from '../dto/find-public-menus.dto';
import { PublicMenuService } from '../services/public-menu.service';

@ApiTags('Public Menus')
@Controller('public/menus')
export class PublicMenuController {
  constructor(private readonly publicMenuService: PublicMenuService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener los menús disponibles hoy de restaurantes cercanos',
  })
  findAvailable(@Query() filters: FindPublicMenusDto) {
    return this.publicMenuService.findAvailable(filters);
  }

  // Antes de ':id' a propósito -- si no, Nest podría intentar matchear
  // "tags" contra la ruta ':id' (ParseIntPipe la rechazaría con un 400
  // en vez de nunca llegar acá).
  @Get('tags')
  @ApiOperation({
    summary:
      'Buscar palabras clave (tags) que restaurantes hayan usado en sus menús, por texto parcial',
  })
  findMatchingTags(@Query('search') search?: string) {
    return this.publicMenuService.findMatchingTags(search ?? '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle público de un menú disponible' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicMenuService.findOne(BigInt(id));
  }
}
