import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
} from 'class-validator';

import { estado_pedido } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del pedido',
    enum: estado_pedido,
    example: estado_pedido.aceptado,
  })
  @IsEnum(estado_pedido)
  estado!: estado_pedido;
}