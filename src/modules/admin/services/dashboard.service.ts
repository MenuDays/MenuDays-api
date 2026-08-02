import { Injectable } from '@nestjs/common';

import {
  estado_reporte,
  estado_solicitud,
  estado_publicacion,
  rol_usuario,
} from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Obtener todas las estadísticas
   * generales del Dashboard.
   *
   * Todas las consultas se ejecutan
   * en paralelo para optimizar el
   * tiempo de respuesta.
   */
  async getDashboard() {
    const [
      usuarios,
      restaurantes,
      menus,
      platos,
      promociones,
      reportes,
      reviews,
      favoritos,
    ] = await Promise.all([
      this.getUsersStats(),
      this.getRestaurantsStats(),
      this.getMenusStats(),
      this.getDishesStats(),
      this.getPromotionsStats(),
      this.getReportsStats(),
      this.getReviewsStats(),
      this.getFavoritesStats(),
    ]);

    return {
      usuarios,
      restaurantes,
      menus,
      platos,
      promociones,
      reportes,
      reviews,
      favoritos,
    };
  }

  /**
   * Obtener estadísticas
   * generales de usuarios.
   */
  private async getUsersStats() {
    const [
      total,
      comensales,
      restaurantes,
      administradores,
    ] = await Promise.all([
      this.prisma.usuarios.count(),

      this.prisma.usuarios.count({
        where: {
          rol: rol_usuario.comensal,
        },
      }),

      this.prisma.usuarios.count({
        where: {
          rol: rol_usuario.restaurante,
        },
      }),

      this.prisma.usuarios.count({
        where: {
          rol: rol_usuario.administrador,
        },
      }),
    ]);

    return {
      total,
      comensales,
      restaurantes,
      administradores,
    };
  }

  /**
   * Obtener estadísticas
   * generales de restaurantes.
   */
  /**
 * Obtener estadísticas
 * generales de restaurantes.
 */
private async getRestaurantsStats() {
  const [
    aprobados,
    pendientes,
    rechazados,
  ] = await Promise.all([
    this.prisma.restaurantes.count(),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.pendiente,
      },
    }),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.rechazada,
      },
    }),
  ]);

  return {
    aprobados,
    activos: aprobados,
    pendientes,
    rechazados,
  };
}

  /**
   * Obtener estadísticas
   * generales de menús.
   */
  private async getMenusStats() {
    const today = new Date();

    const [
      total,
      activosHoy,
    ] = await Promise.all([
      this.prisma.menus_del_dia.count(),

      this.prisma.menus_del_dia.count({
        where: {
          estado: estado_publicacion.publicado,
          fecha_inicio: {
            lte: today,
          },
          fecha_fin: {
            gte: today,
          },
        },
      }),
    ]);

    return {
      total,
      activosHoy,
    };
  }
  /**
   * Obtener estadísticas
   * generales de platos.
   */
  private async getDishesStats() {
    const total =
      await this.prisma.platos.count();

    return {
      total,
    };
  }

  /**
   * Obtener estadísticas
   * generales de promociones.
   */
  private async getPromotionsStats() {
    const [
      total,
      activas,
    ] = await Promise.all([
      this.prisma.promociones.count(),

      this.prisma.promociones.count({
        where: {
          activa: true,
        },
      }),
    ]);

    return {
      total,
      activas,
    };
  }

  /**
   * Obtener estadísticas
   * generales de reportes.
   */
  private async getReportsStats() {
    const [
      pendientes,
      resueltos,
    ] = await Promise.all([
      this.prisma.reportes.count({
        where: {
          estado: estado_reporte.pendiente,
        },
      }),

      this.prisma.reportes.count({
        where: {
          estado: estado_reporte.resuelto,
        },
      }),
    ]);

    return {
      pendientes,
      resueltos,
    };
  }

  /**
 * Obtener estadísticas
 * generales de reseñas.
 */
private async getReviewsStats() {
  const total =
    await this.prisma.resenas.count();

  return {
    total,
  };
}

  /**
   * Obtener estadísticas
   * generales de favoritos.
   */
  private async getFavoritesStats() {
    const total =
      await this.prisma.favoritos.count();

    return {
      total,
    };
  }
}