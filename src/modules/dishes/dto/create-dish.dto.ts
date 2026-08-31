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
import { parsePriceValue } from '../../../core/common/utils/parse-price.util';

// Los booleanos llegan por multipart/form-data como string ("true"/
// "false"), no como boolean real -- esto los normaliza antes de que
// corra @IsBoolean().
function parseFormBoolean(fallback: boolean) {
  return ({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  };
}

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
  @Transform(({ value }) => parsePriceValue(value))
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
  @Transform(parseFormBoolean(true))
  @IsBoolean()
  activo: boolean = true;

  @ApiPropertyOptional({
    example: false,
    description:
      'Indica si el plato aparece en el carrusel de "Platos destacados" del comensal.',
    default: false,
  })
  @IsOptional()
  @Transform(parseFormBoolean(false))
  @IsBoolean()
  destacado?: boolean = false;

  @ApiPropertyOptional({
    example: false,
    description:
      'Indica si el plato aparece en el carrusel de "Ofertas" del comensal.',
    default: false,
  })
  @IsOptional()
  @Transform(parseFormBoolean(false))
  @IsBoolean()
  enOferta?: boolean = false;

  @ApiPropertyOptional({
    example: 12.5,
    description:
      'Precio con descuento -- solo tiene sentido si enOferta es true. Opcional: sin este valor, el plato se muestra como "en oferta" sin precio tachado.',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? parsePriceValue(value) : undefined))
  @IsNumber()
  precioOferta?: number;
}