import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { estado_disponibilidad } from '@prisma/client';
import { IsEnum } from 'class-validator';

import { Transform } from 'class-transformer';

export class UpdateDishDto {

  @ApiPropertyOptional({
    example: 'Milanesa con papas fritas',
    description: 'Nombre del plato.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @ApiPropertyOptional({
    example:
      'Milanesa de carne acompañada de papas fritas.',
    description: 'Descripción del plato.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({
    example: 15.5,
    description: 'Precio del plato.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  precio?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la categoría.',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  categoriaId?: number;

  @ApiPropertyOptional({
    example: 'disponible',
    description: 'Estado del plato.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @IsOptional()
@IsEnum(estado_disponibilidad)
estado?: estado_disponibilidad;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el plato está activo.',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  activo?: boolean;
}