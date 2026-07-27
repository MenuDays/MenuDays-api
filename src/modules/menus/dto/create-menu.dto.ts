import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @Type(() => Number)
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  precio!: number;

  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;
}