import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  IsEnum,
  IsInt,
} from 'class-validator';
import { estado_publicacion } from '@prisma/client';
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

  @IsOptional()
  @IsEnum(estado_publicacion)
  estado?: estado_publicacion;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoriaId!: number;

  // Colección de menús (Entradas/Sopas/etc.) -- opcional a propósito: es un
  // concepto distinto e independiente de categoriaId (ver menu_colecciones
  // en el schema), y no debe ser obligatorio para no romper el flujo
  // existente de creación de menús.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  coleccionId?: number;
}