import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { PasswordService } from './services/password.service';
import { JwtTokenService } from './services/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}


  async register(registerDto: RegisterDto) {
    //buscamos si existe el usuario, si existe devolvemos una bad request pa q no nos de errores de duplicación
  const existingUser = await this.prisma.usuarios.findFirst({
    where: {
      email: registerDto.email,
    },
  });

  if (existingUser) {
    throw new ConflictException(
      'Ya existe un usuario registrado con ese correo electrónico.',
    );
  } //error 409

//hasheamos la contraseña xq nunca se guarda realmente como viene
  const passwordHash = await this.passwordService.hash(
    registerDto.password,
  );

  //crea el usuario
  const usuario = await this.prisma.usuarios.create({
    data: {
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      email: registerDto.email,
      password_hash: passwordHash,
    },
  });

  //generamos el token
  //generamos el token
const token = await this.jwtTokenService.generateToken({
  sub: usuario.id.toString(),
  email: usuario.email,
  rol: usuario.rol,
});

  //eliminamos el hash al front
const { password_hash, ...userWithoutPassword } = usuario;

return {
  message: 'Usuario registrado correctamente.',
  access_token: token,
  user: {
    ...userWithoutPassword,
    id: usuario.id.toString(),
    radio_busqueda_km:
      usuario.radio_busqueda_km.toNumber(),
    ubicacion_lat:
      usuario.ubicacion_lat?.toNumber() ?? null,
    ubicacion_lng:
      usuario.ubicacion_lng?.toNumber() ?? null,
  },
};
  }

  async login(loginDto: LoginDto) {
  const usuario = await this.prisma.usuarios.findFirst({
    where: {
      email: loginDto.email,
    },
  });

  if (!usuario) {
    throw new UnauthorizedException(
      'Correo electrónico o contraseña incorrectos.',
    );
  }

  const passwordCorrecta = await this.passwordService.compare(
    loginDto.password,
    usuario.password_hash,
  );

  if (!passwordCorrecta) {
    throw new UnauthorizedException(
      'Correo electrónico o contraseña incorrectos.',
    );
  }

  if (usuario.estado === 'eliminado') {
    throw new ForbiddenException(
      'La cuenta fue eliminada.',
    );
  }

  if (usuario.estado === 'suspendido') {
    throw new ForbiddenException(
      'La cuenta se encuentra suspendida.',
    );
  }

  const token = await this.jwtTokenService.generateToken({
  sub: usuario.id.toString(),
  email: usuario.email,
  rol: usuario.rol,
});

  const { password_hash, ...userWithoutPassword } = usuario;

return {
  message: 'Inicio de sesión exitoso.',
  access_token: token,
  user: {
    ...userWithoutPassword,
    id: usuario.id.toString(),
    radio_busqueda_km:
      usuario.radio_busqueda_km.toNumber(),
    ubicacion_lat:
      usuario.ubicacion_lat?.toNumber() ?? null,
    ubicacion_lng:
      usuario.ubicacion_lng?.toNumber() ?? null,
  },
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
async validateUser(
  email: string,
  password: string,
): Promise<any> {
  const usuario = await this.prisma.usuarios.findFirst({
    where: {
      email,
    },
  });

  if (!usuario) {
    return null;
  }

  const passwordCorrecta =
    await this.passwordService.compare(
      password,
      usuario.password_hash,
    );

  if (!passwordCorrecta) {
    return null;
  }

  const { password_hash, ...userWithoutPassword } = usuario;

  return {
  ...userWithoutPassword,
  id: usuario.id.toString(),
  radio_busqueda_km:
    usuario.radio_busqueda_km.toNumber(),
  ubicacion_lat:
    usuario.ubicacion_lat?.toNumber() ?? null,
  ubicacion_lng:
    usuario.ubicacion_lng?.toNumber() ?? null,
};
}
  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    return {
      message: 'Cuenta eliminada correctamente',
      data: deleteAccountDto,
    };
  }
}