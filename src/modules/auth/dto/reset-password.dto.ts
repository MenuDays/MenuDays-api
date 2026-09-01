import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'El enlace de recuperación no es válido.' })
  @IsNotEmpty({ message: 'Falta el enlace de recuperación.' })
  token!: string;

  @IsString({ message: 'La contraseña no es válida.' })
  @IsNotEmpty({ message: 'Ingresá la nueva contraseña.' })
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(100, { message: 'La contraseña es demasiado larga.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número.',
  })
  newPassword!: string;
}
