import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsOptional,
} from 'class-validator';

import { estado_pedido } from '@prisma/client';

export class UserOrdersFilterDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado del pedido',
    enum: estado_pedido,
    example: estado_pedido.pendiente,
  })
  @IsOptional()
  @IsEnum(estado_pedido)
  estado?: estado_pedido;
}