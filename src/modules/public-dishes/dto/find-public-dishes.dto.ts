import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Si es true, devuelve solo platos marcados como "destacado".',
    example: 'true',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  destacado?: boolean;

  @ApiPropertyOptional({
    description: 'Si es true, devuelve solo platos marcados como "en oferta".',
    example: 'true',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  enOferta?: boolean;
}