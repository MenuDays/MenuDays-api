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
import { parsePriceValue } from '../../../core/common/utils/parse-price.util';

function parseFormBoolean({ value }: { value: unknown }) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
}

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
  @Transform(({ value }) => parsePriceValue(value))
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

  @ApiPropertyOptional({
    example: false,
    description:
      'Indica si el plato aparece en el carrusel de "Platos destacados" del comensal.',
  })
  @IsOptional()
  @Transform(parseFormBoolean)
  @IsBoolean()
  destacado?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Indica si el plato aparece en el carrusel de "Ofertas" del comensal.',
  })
  @IsOptional()
  @Transform(parseFormBoolean)
  @IsBoolean()
  enOferta?: boolean;

  @ApiPropertyOptional({
    example: 12.5,
    description:
      'Precio con descuento -- solo tiene sentido si enOferta es true. Mandar null/cadena vacía lo limpia.',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' && value !== 'null' ? parsePriceValue(value) : null))
  @IsNumber()
  precioOferta?: number | null;
}