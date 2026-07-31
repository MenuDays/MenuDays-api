import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {

  @ApiProperty({
    example: 15,
    description: 'ID del pedido entregado.',
  })
  @IsNotEmpty()
  @IsInt()
  pedidoId!: number;

  @ApiProperty({
    example: 5,
    description: 'Calificación del restaurante (1 a 5 estrellas).',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion!: number;

  @ApiProperty({
    example: 'Excelente atención y la comida llegó caliente.',
    description: 'Comentario de la reseña.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comentario?: string;

}