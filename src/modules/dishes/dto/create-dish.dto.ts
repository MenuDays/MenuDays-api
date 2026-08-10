import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { estado_disponibilidad } from '@prisma/client';
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
  @IsEnum(estado_disponibilidad)
  estado?: estado_disponibilidad;

  @ApiPropertyOptional({
    example: true,
    description:
      'Indica si el plato está activo. Si no se envía, se crea activo automáticamente.',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return true;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    return Boolean(value);
  })
  @IsBoolean()
  activo: boolean = true;
}