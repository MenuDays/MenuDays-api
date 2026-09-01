import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

// Cada validación lleva su propio mensaje en español explicando qué
// campo falla y por qué -- así el usuario sabe exactamente qué corregir
// (no un "Bad Request" ni un mensaje genérico).
export class RegisterDto {
  @IsString({ message: 'El nombre no es válido.' })
  @IsNotEmpty({ message: 'Ingresá tu nombre.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres.' })
  nombre!: string;

  @IsString({ message: 'El apellido no es válido.' })
  @IsNotEmpty({ message: 'Ingresá tu apellido.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  @MaxLength(100, {
    message: 'El apellido no puede superar los 100 caracteres.',
  })
  apellido!: string;

  @IsNotEmpty({ message: 'Ingresá tu correo electrónico.' })
  @IsEmail(
    {},
    {
      message:
        'El correo electrónico no tiene un formato válido (ejemplo: nombre@dominio.com).',
    },
  )
  @MaxLength(150, { message: 'El correo electrónico es demasiado largo.' })
  email!: string;

  @IsString({ message: 'La contraseña no es válida.' })
  @IsNotEmpty({ message: 'Ingresá una contraseña.' })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(100, { message: 'La contraseña es demasiado larga.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número.',
  })
  password!: string;
}
