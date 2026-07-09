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
          expiresIn: '7d',
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