import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { estado_disponibilidad } from '@prisma/client';
import { IsEnum } from 'class-validator';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateDishDto {

  @ApiProperty({
    example: 'Milanesa con papas fritas',
    description: 'Nombre del plato.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @ApiProperty({
    example:
      'Milanesa de carne acompañada de papas fritas.',
    description: 'Descripción del plato.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion!: string;

  @ApiProperty({
    example: 15.5,
    description: 'Precio del plato.',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  precio!: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría.',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  categoriaId!: number;

  @ApiPropertyOptional({
    example: 'disponible',
    description: 'Estado del plato.',
    default: 'disponible',
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
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  activo?: boolean;
}