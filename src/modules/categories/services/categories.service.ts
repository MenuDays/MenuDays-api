import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Obtener todas las categorías activas.
   *
   * Se devuelven únicamente las
   * categorías habilitadas para
   * ser utilizadas por el frontend.
   */
  async findAll() {
    return this.prisma.categorias.findMany({
      where: {
        activo: true,
      },
      include: {
        iconos: {
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }
}