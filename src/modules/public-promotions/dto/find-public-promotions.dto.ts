import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Las promociones públicas usan exactamente los mismos filtros de ubicación
 * que Explore para que ambos listados representen el mismo radio.
 */
export class FindPublicPromotionsDto extends FindRestaurantsDto {
  @ApiPropertyOptional({
    description: 'ID de la categoría de la promoción.',
    example: '3',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? BigInt(value) : undefined))
  categoriaId?: bigint;
}