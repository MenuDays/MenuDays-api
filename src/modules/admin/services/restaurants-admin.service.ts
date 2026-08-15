import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { estado_cuenta_rest, Prisma } from '@prisma/client';

import { UpdateRestaurantStatusDto } from '../dto/update-restaurant-status.dto';

@Injectable()
export class RestaurantsAdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Listado de restaurantes para el panel de administración.
   *
   * Permite filtrar por estado de cuenta y por nombre comercial.
   */
  async getAllRestaurants(filters: { estado?: string; name?: string }) {
    const where: Prisma.restaurantesWhereInput = {};

    if (filters.estado) {
      where.estado_cuenta = filters.estado as estado_cuenta_rest;
    }

    if (filters.name) {
      where.nombre_comercial = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    return this.prisma.restaurantes.findMany({
      where,
      select: {
        id: true,
        nombre_comercial: true,
        logo_url: true,
        estado_cuenta: true,
        estado_operativo: true,
        calificacion_promedio: true,
        cantidad_resenas: true,
        created_at: true,
        ciudad: {
          select: {
            nombre: true,
          },
        },
        _count: {
          select: {
            reportes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Detalle de un restaurante para el panel de administración.
   */
  async getRestaurantById(id: bigint) {
    const restaurant = await this.prisma.restaurantes.findUnique({
      where: { id },
      include: {
        ciudad: {
          include: {
            provincia: true,
          },
        },
        _count: {
          select: {
            reportes: true,
            resenas: true,
            pedidos: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('El restaurante no existe.');
    }

    return restaurant;
  }

  /**
   * Actualizar el estado de cuenta de un restaurante
   * (pausar/reactivar/eliminar) como acción administrativa.
   *
   * No es un DELETE físico: cambia `estado_cuenta`, que ya es
   * respetado por todos los endpoints públicos (explorar, búsqueda,
   * favoritos, reseñas, pedidos) por lo que un restaurante
   * suspendido/eliminado deja de ser visible sin perder su historial.
   */
  async updateStatus(id: bigint, dto: UpdateRestaurantStatusDto) {
    await this.getRestaurantById(id);

    return this.prisma.restaurantes.update({
      where: { id },
      data: {
        estado_cuenta: dto.estado,
      },
      select: {
        id: true,
        nombre_comercial: true,
        estado_cuenta: true,
      },
    });
  }
}
