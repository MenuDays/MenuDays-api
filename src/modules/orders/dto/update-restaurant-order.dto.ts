import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { metodo_entrega } from '@prisma/client';

import { parsePriceValue } from '../../../core/common/utils/parse-price.util';

/**
 * Edición de un pedido por parte del restaurante dueño -- pensada para
 * corregir errores logísticos, no para rehacer el pedido. Sólo se
 * permiten los campos que se pueden cambiar sin romper la lógica del
 * pedido (ver OrderService.updateRestaurantOrder): observaciones,
 * método de entrega y total. Todos opcionales: se actualiza sólo lo
 * que venga.
 */
export class UpdateRestaurantOrderDto {
  @ApiPropertyOptional({
    description: 'Observaciones del pedido.',
    example: 'Sin cebolla. Entregar en portería.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;

  @ApiPropertyOptional({
    description: 'Método de entrega del pedido.',
    enum: metodo_entrega,
    example: metodo_entrega.RETIRO_EN_LOCAL,
  })
  @IsOptional()
  @IsEnum(metodo_entrega)
  metodoEntrega?: metodo_entrega;

  @ApiPropertyOptional({
    description: 'Total del pedido (para ajustar cargos o descuentos).',
    example: 15.5,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== '' && value !== null
      ? parsePriceValue(value)
      : undefined,
  )
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioTotal?: number;
}
