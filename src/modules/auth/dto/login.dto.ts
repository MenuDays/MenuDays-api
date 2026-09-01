import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Ingresá tu correo electrónico.' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  email!: string;

  @IsString({ message: 'La contraseña no es válida.' })
  @IsNotEmpty({ message: 'Ingresá tu contraseña.' })
  password!: string;
}
