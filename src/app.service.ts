import { Injectable } from '@nestjs/common';
import { PrismaService } from './core/database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    const usuarios = await this.prisma.usuarios.count();

    return {
      mensaje: 'Backend funcionando',
      usuarios,
    };
  }
}