import {
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { telefono_tipo } from '@prisma/client';

export class UpdateRestaurantPhoneDto {
  @ApiProperty({
    example: '0999999999',
  })
  @IsString()
  @MaxLength(30)
  telefono!: string;

  @ApiProperty({
    enum: telefono_tipo,
    example: telefono_tipo.ambos,
  })
  @IsEnum(telefono_tipo)
  tipo!: telefono_tipo;
}