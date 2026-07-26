import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Belén',
    description: 'Nombre del usuario',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  })
  @MaxLength(50, {
    message: 'El nombre no puede superar los 50 caracteres.',
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Gómez',
    description: 'Apellido del usuario',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  })
  @MaxLength(50, {
    message: 'El apellido no puede superar los 50 caracteres.',
  })
  lastName?: string;

  @ApiPropertyOptional({
    example: '+593991234567',
    description: 'Número de teléfono en formato internacional',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message:
      'El número de teléfono debe estar en formato internacional.',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la provincia',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'La provincia debe ser un número.',
  })
  provinceId?: number;

  @ApiPropertyOptional({
    example: 15,
    description: 'ID de la ciudad',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'La ciudad debe ser un número.',
  })
  cityId?: number;
  @ApiPropertyOptional({
  example: -2.170998,
  description: 'Latitud del usuario',
})
@IsOptional()
@Type(() => Number)
latitude?: number;

@ApiPropertyOptional({
  example: -79.922359,
  description: 'Longitud del usuario',
})
@IsOptional()
@Type(() => Number)
longitude?: number;
}