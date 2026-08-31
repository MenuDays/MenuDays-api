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
import { parsePriceValue } from '../../../core/common/utils/parse-price.util';

// Los campos array (componente_*, tags, diasSemana) llegan por
// multipart/form-data, así que el array real viaja serializado en JSON
// dentro de un string -- esto lo parsea antes de que corran los
// validadores de cada campo.
function parseJsonArray({ value }: { value: unknown }): unknown {
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
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  // Acepta coma o punto decimal ("12,50" / "12.50") -- se normaliza a
  // number antes de validar.
  @Transform(({ value }) => parsePriceValue(value))
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

  // Menú compuesto: lista libre de nombres por cada tipo fijo -- un
  // mismo tipo puede tener más de un nombre (ej. dos entradas
  // distintas ese día). Todos opcionales -- un restaurante puede
  // completar solo algunos tipos (ej. solo entrada y postre). Llega
  // como multipart/form-data, así que el array real viaja serializado
  // en JSON -- se transforma acá antes de validar cada elemento (mismo
  // patrón que `tags` más abajo).
  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  componenteEntrada?: string[];

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  componenteSopa?: string[];

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  componentePlatoFuerte?: string[];

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  componenteJugo?: string[];

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  componentePostre?: string[];

  // Palabras clave (chips).
  @IsOptional()
  @Transform(parseJsonArray)
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
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(7)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  diasSemana?: number[];
}