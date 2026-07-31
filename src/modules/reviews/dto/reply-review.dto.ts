import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ReplyReviewDto {

  @ApiProperty({
    example: 'Muchas gracias por tu visita. ¡Te esperamos nuevamente!',
    description: 'Respuesta del restaurante a la reseña.',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  respuesta!: string;

}