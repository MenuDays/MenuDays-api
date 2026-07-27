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
  const provincia =
    await this.prisma.provincias.findUnique({
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

  const ciudades =
    await this.prisma.ciudades.findMany({
      where: {
        provincia_id: provinciaId,
      },
      select: {
        id: true,
        nombre: true,
        latitud: true,
        longitud: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

  return ciudades.map((ciudad) => ({
    ...ciudad,
    latitud: ciudad.latitud
      ? Number(ciudad.latitud)
      : null,
    longitud: ciudad.longitud
      ? Number(ciudad.longitud)
      : null,
  }));
}
}