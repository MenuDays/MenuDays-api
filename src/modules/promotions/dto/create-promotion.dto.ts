import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  IsPositive,
  Min,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { parsePriceValue } from '../../../core/common/utils/parse-price.util';

export class CreatePromotionDto {
  @ApiProperty({
    example: '2x1 en Hamburguesas',
    description: 'Título de la promoción.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo!: string;


  @ApiPropertyOptional({
  example: 1,
  description: 'ID de la categoría de la promoción.',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoriaId?: number;
  @ApiPropertyOptional({
    example: 'Válido de lunes a jueves.',
    description:
      'Descripción opcional de la promoción.',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
  example: 8.99,
  description: 'Precio de la promoción.',
})
@Transform(({ value }) => parsePriceValue(value))
@IsNumber()
@Min(0)
precio!: number;
  @ApiProperty({
    example: '2026-07-28',
    description:
      'Fecha de inicio de la promoción.',
  })
  @IsDateString()
  fechaInicio!: string;

  @ApiProperty({
    example: '2026-08-10',
    description:
      'Fecha de finalización de la promoción.',
  })
  @IsDateString()
  fechaFin!: string;
}