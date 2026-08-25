import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PasswordService } from './services/password.service';
import { JwtTokenService } from './services/jwt.service';
import { MailService } from './services/mail.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { PrismaModule } from '../../core/database/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // Antes estaba hardcodeado en 7d (ignorando JWT_EXPIRES_IN del
          // .env) -- una sesión de comensal/restaurante debe durar mucho
          // más que eso (como Uber Eats/Rappi: prácticamente no vence
          // salvo que el usuario cierre sesión), no cortarse a la semana.
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '365d',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    PasswordService,
    JwtTokenService,
    MailService,
    JwtStrategy,
    LocalStrategy,
  ],

  exports: [
    AuthService,
    JwtTokenService,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}