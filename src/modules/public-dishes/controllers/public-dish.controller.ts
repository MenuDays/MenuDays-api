import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { FindPublicDishesDto } from '../dto/find-public-dishes.dto';
import { PublicDishService } from '../services/public-dish.service';

@ApiTags('Public Dishes')
@Controller('public/dishes')
export class PublicDishController {
  constructor(private readonly publicDishService: PublicDishService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener los platos disponibles de restaurantes cercanos',
  })
  findAvailable(@Query() filters: FindPublicDishesDto) {
    return this.publicDishService.findAvailable(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle público de un plato disponible' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicDishService.findOne(BigInt(id));
  }
}