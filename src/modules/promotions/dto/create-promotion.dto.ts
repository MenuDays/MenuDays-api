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
} from 'class-validator';

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
    example: 'Válido de lunes a jueves.',
    description:
      'Descripción opcional de la promoción.',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

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