import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { estado_cuenta_rest } from '@prisma/client';

export class UpdateRestaurantStatusDto {
  @ApiProperty({
    enum: estado_cuenta_rest,
    example: estado_cuenta_rest.suspendido,
  })
  @IsEnum(estado_cuenta_rest)
  estado: estado_cuenta_rest;
}
