import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class LocationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Obtener todas las provincias de Ecuador.
   */
  async getProvincias() {
    return await this.prisma.provincias.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  /**
   * Obtener todas las ciudades de una provincia.
   */
  async getCiudadesByProvincia(provinciaId: bigint) {
    const provincia = await this.prisma.provincias.findUnique({
      where: {
        id: provinciaId,
      },
      select: {
        id: true,
      },
    });

    if (!provincia) {
      throw new NotFoundException(
        'La provincia especificada no existe.',
      );
    }

    return await this.prisma.ciudades.findMany({
      where: {
        provincia_id: provinciaId,
      },
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }
}