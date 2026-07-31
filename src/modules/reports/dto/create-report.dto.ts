import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'ID del restaurante a reportar',
    example: 1,
  })
  @IsInt()
  @Min(1)
  restauranteId!: number;

  @ApiProperty({
    description: 'ID del motivo del reporte',
    example: 2,
  })
  @IsInt()
  @Min(1)
  motivoId!: number;

  @ApiPropertyOptional({
    description: 'Descripción adicional del reporte',
    example: 'El restaurante publica información falsa sobre sus horarios.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  descripcion?: string;
}