import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'ID del menú a comprar',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  menuId?: number;

  @ApiPropertyOptional({
    description: 'ID de la promoción a comprar',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  promotionId?: number;

  @ApiPropertyOptional({
    description: 'ID del plato a comprar',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  dishId?: number;

  @ApiPropertyOptional({
    description: 'Observaciones del pedido',
    example: 'Sin cebolla',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}
