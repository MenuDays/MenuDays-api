import {
  IsEnum,
  IsString,
  IsUrl,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { red_social_tipo } from '@prisma/client';

export class UpdateRestaurantSocialDto {
  @ApiProperty({
    enum: red_social_tipo,
    example: red_social_tipo.instagram,
  })
  @IsEnum(red_social_tipo)
  plataforma!: red_social_tipo;

  @ApiProperty({
    example: 'https://instagram.com/restaurante',
  })
  @IsString()
  @IsUrl()
  url!: string;
}