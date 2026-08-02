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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle público de un menú disponible' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicMenuService.findOne(BigInt(id));
  }
}
