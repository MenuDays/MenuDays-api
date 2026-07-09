import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    return {
      message: 'Registro de usuario',
      data: registerDto,
    };
  }

  async login(loginDto: LoginDto) {
    return {
      message: 'Inicio de sesión',
      data: loginDto,
    };
  }

  async logout() {
    return {
      message: 'Sesión cerrada correctamente',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return {
      message: 'Correo de recuperación enviado',
      data: forgotPasswordDto,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return {
      message: 'Contraseña restablecida correctamente',
      data: resetPasswordDto,
    };
  }
async validateUser(email: string, password: string): Promise<any> {
  // TODO: implementar con Prisma y bcrypt
  return null;
}
  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    return {
      message: 'Cuenta eliminada correctamente',
      data: deleteAccountDto,
    };
  }
}