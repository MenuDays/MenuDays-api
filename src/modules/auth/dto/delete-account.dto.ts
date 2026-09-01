import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsString({ message: 'La contraseña no es válida.' })
  @IsNotEmpty({
    message:
      'Ingresá tu contraseña para confirmar que querés eliminar la cuenta.',
  })
  password!: string;
}
