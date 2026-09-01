import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Ingresá tu correo electrónico.' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  email!: string;
}
