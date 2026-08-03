import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { FindPublicPromotionsDto } from '../dto/find-public-promotions.dto';
import { PublicPromotionService } from '../services/public-promotion.service';

@ApiTags('Public Promotions')
@Controller('public/promotions')
export class PublicPromotionController {
  constructor(
    private readonly publicPromotionService: PublicPromotionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener las promociones disponibles de restaurantes cercanos',
  })
  findAvailable(@Query() filters: FindPublicPromotionsDto) {
    return this.publicPromotionService.findAvailable(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener el detalle público de una promoción disponible',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicPromotionService.findOne(BigInt(id));
  }
}