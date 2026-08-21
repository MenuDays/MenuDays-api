import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  IsEnum,
  IsInt,
  Max,
  Min,
} from 'class-validator';
import { estado_publicacion, tipo_programacion_menu } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

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
  // existente de creación de menús. Se mantiene por compatibilidad con
  // datos viejos; el front ya no lo usa para menús nuevos (ver
  // componente* más abajo).
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  coleccionId?: number;

  // Menú compuesto: nombre libre de cada plato interno, uno por tipo
  // fijo. Todos opcionales -- un restaurante puede completar solo
  // algunos (ej. solo entrada y postre).
  @IsOptional()
  @IsString()
  @MaxLength(150)
  componenteEntrada?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  componenteSopa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  componentePlatoFuerte?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  componenteJugo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  componentePostre?: string;

  // Palabras clave (chips). Llega como multipart/form-data, así que un
  // array real se manda serializado en JSON -- se transforma acá antes
  // de validar cada elemento.
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value ? [value] : [];
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMaxSize(15)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(tipo_programacion_menu)
  tipoProgramacion?: tipo_programacion_menu;

  // 1=Lunes ... 7=Domingo, solo relevante si tipoProgramacion = 'semanal'.
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value ? [value] : [];
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMaxSize(7)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  diasSemana?: number[];
}