import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { FindRestaurantsDto } from '../../explore/dto/find-restaurants.dto';

/**
 * Búsqueda transversal del comensal. Hereda de FindRestaurantsDto:
 *  - `search`  -> el texto a buscar (nombre / descripción / categoría /
 *    tags / restaurante).
 *  - latitude / longitude / radius / provinceId / cityId -> mismo
 *    alcance geográfico que el resto de los listados públicos.
 */
export class FindPublicSearchDto extends FindRestaurantsDto {
  @ApiPropertyOptional({
    description: 'Cantidad máxima de resultados a devolver.',
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
