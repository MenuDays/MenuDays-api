import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRestaurantCategoriesDto {
  @ApiProperty({
    description:
      'IDs de las categorías seleccionadas por el restaurante.',
    example: [1, 5, 8],
    type: [Number],
  })
  @IsArray({
    message:
      'Las categorías deben enviarse en un arreglo.',
  })
  @ArrayNotEmpty({
    message:
      'Debe seleccionar al menos una categoría.',
  })
  @ArrayUnique({
    message:
      'No puede enviar categorías duplicadas.',
  })
  @IsInt({
    each: true,
    message:
      'Todos los IDs de categorías deben ser números enteros.',
  })
  @Type(() => Number)
  categoryIds!: number[];
}