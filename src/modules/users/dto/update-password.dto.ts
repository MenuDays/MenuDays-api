import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'MiPassword123',
    description: 'Contraseña actual del usuario',
  })
  @IsString()
  @IsNotEmpty({
    message: 'La contraseña actual es obligatoria.',
  })
  currentPassword!: string;

  @ApiProperty({
    example: 'NuevaPassword123',
    description: 'Nueva contraseña del usuario',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({
    message: 'La nueva contraseña es obligatoria.',
  })
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres.',
  })
  newPassword!: string;
}