import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { estado_pedido } from '@prisma/client';

export class RestaurantOrdersFilterDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado del pedido',
    enum: estado_pedido,
    example: estado_pedido.pendiente,
  })
  @IsOptional()
  @IsEnum(estado_pedido)
  estado?: estado_pedido;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha (YYYY-MM-DD)',
    example: '2026-08-02',
  })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}