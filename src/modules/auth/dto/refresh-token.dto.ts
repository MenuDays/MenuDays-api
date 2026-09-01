import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'La sesión no es válida. Iniciá sesión de nuevo.' })
  @IsNotEmpty({ message: 'Falta el token de sesión. Iniciá sesión de nuevo.' })
  refreshToken!: string;
}
