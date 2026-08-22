import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Los menús públicos usan exactamente los mismos filtros de ubicación
 * que Explore para que ambos listados representen el mismo radio.
 */
export class FindPublicMenusDto extends FindRestaurantsDto {
  @ApiPropertyOptional({
    description: 'ID de la categoría del menú.',
    example: '3',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? BigInt(value) : undefined))
  categoriaId?: bigint;

  @ApiPropertyOptional({
    description:
      'Palabra clave exacta (tag) del menú -- ver campo `tags` en menus_del_dia. Devuelve solo los menús que tengan ese tag.',
    example: 'carnes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tag?: string;
}
