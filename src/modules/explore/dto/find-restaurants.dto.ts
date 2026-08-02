import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsLatitude,
  IsLongitude,
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
  @Transform(({ value }) => (value !== undefined ? BigInt(value) : undefined))
  provinceId?: bigint;

  @ApiPropertyOptional({
    description: 'ID de la ciudad.',
    example: '15',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? BigInt(value) : undefined))
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

  @ApiPropertyOptional({
    description: 'Latitud desde la que se calcula la distancia.',
    example: -0.180653,
  })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitud desde la que se calcula la distancia.',
    example: -78.467834,
  })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;
}
