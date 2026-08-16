import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Los platos públicos usan exactamente los mismos filtros de ubicación
 * que Explore para que ambos listados representen el mismo radio.
 */
export class FindPublicDishesDto extends FindRestaurantsDto {
  @ApiPropertyOptional({
    description: 'ID de la categoría del plato.',
    example: '3',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? BigInt(value) : undefined))
  categoriaId?: bigint;
}