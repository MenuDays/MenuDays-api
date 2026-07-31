import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindRestaurantsDto {
  @ApiPropertyOptional({
    description: 'Buscar por nombre del restaurante.',
    example: 'Pizza',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ID de la provincia.',
    example: '1',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? BigInt(value) : undefined,
  )
  provinceId?: bigint;

  @ApiPropertyOptional({
    description: 'ID de la ciudad.',
    example: '15',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? BigInt(value) : undefined,
  )
  cityId?: bigint;

  @ApiPropertyOptional({
    description: 'Radio de búsqueda en kilómetros.',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  radius?: number;
}