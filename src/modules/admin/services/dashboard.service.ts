import { Injectable } from '@nestjs/common';

import {
  estado_reporte,
  estado_solicitud,
  estado_publicacion,
  estado_cuenta_rest,
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
      solicitudes,
      menus,
      platos,
      promociones,
      reportes,
      reviews,
      favoritos,
      topReportes,
      topResenas,
      weeklyRequests,
      growth,
    ] = await Promise.all([
      this.getUsersStats(),
      this.getRestaurantsStats(),
      this.getRestaurantRequestsStats(),
      this.getMenusStats(),
      this.getDishesStats(),
      this.getPromotionsStats(),
      this.getReportsStats(),
      this.getReviewsStats(),
      this.getFavoritesStats(),
      this.getTopRestaurantsByReports(),
      this.getTopRestaurantsByReviews(),
      this.getWeeklyRequests(),
      this.getGrowthStats(),
    ]);

    return {
      usuarios,
      restaurantes,
      solicitudes,
      menus,
      platos,
      promociones,
      reportes,
      reviews,
      favoritos,
      topReportes,
      topResenas,
      weeklyRequests,
      growth,
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
    activos,
    suspendidos,
    eliminados,
    pendientes,
    aceptadas,
    rechazadas,
  ] = await Promise.all([
    this.prisma.restaurantes.count({
      where: {
        estado_cuenta: estado_cuenta_rest.activo,
      },
    }),

    this.prisma.restaurantes.count({
      where: {
        estado_cuenta: estado_cuenta_rest.suspendido,
      },
    }),

    this.prisma.restaurantes.count({
      where: {
        estado_cuenta: estado_cuenta_rest.eliminado,
      },
    }),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.pendiente,
      },
    }),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.aprobada,
      },
    }),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.rechazada,
      },
    }),
  ]);

  return {
    activos,
    suspendidos,
    eliminados,

    solicitudes: {
      total: pendientes + aceptadas + rechazadas,
      aceptadas,
      pendientes,
      rechazadas,
    },
  };
}

private async getRestaurantRequestsStats() {
  const [
    total,
    pendientes,
    aceptadas,
    rechazadas,
  ] = await Promise.all([
    this.prisma.solicitudes_restaurante.count(),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.pendiente,
      },
    }),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.aprobada,
      },
    }),

    this.prisma.solicitudes_restaurante.count({
      where: {
        estado: estado_solicitud.rechazada,
      },
    }),
  ]);

  return {
    total,
    pendientes,
    aceptadas,
    rechazadas,
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
  private async getTopRestaurantsByReports() {
  const top = await this.prisma.reportes.groupBy({
    by: ['restaurante_id'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 5,
  });

  const restaurants = await Promise.all(
    top.map(async (item) => {
      const restaurant = await this.prisma.restaurantes.findUnique({
        where: {
          id: item.restaurante_id,
        },
        select: {
          id: true,
          nombre_comercial: true,
        },
      });

      return {
        id: restaurant?.id,
        nombre: restaurant?.nombre_comercial,
        reportes: item._count.id,
      };
    }),
  );

  return restaurants;
}
private async getTopRestaurantsByReviews() {
  const top = await this.prisma.resenas.groupBy({
    by: ['restaurante_id'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 5,
  });

  const restaurants = await Promise.all(
    top.map(async (item) => {
      const restaurant = await this.prisma.restaurantes.findUnique({
        where: {
          id: item.restaurante_id,
        },
        select: {
          id: true,
          nombre_comercial: true,
        },
      });

      return {
        id: restaurant?.id,
        nombre: restaurant?.nombre_comercial,
        resenas: item._count.id,
      };
    }),
  );

  return restaurants;
}
private async getWeeklyRequests() {
  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const requests =
    await this.prisma.solicitudes_restaurante.findMany({
      where: {
        created_at: {
          gte: start,
        },
      },
      select: {
        created_at: true,
      },
    });

  const days: { fecha: string; total: number }[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);

    const total = requests.filter((request) => {
      return (
        request.created_at.getFullYear() === current.getFullYear() &&
        request.created_at.getMonth() === current.getMonth() &&
        request.created_at.getDate() === current.getDate()
      );
    }).length;

    days.push({
      fecha: current.toISOString().split('T')[0]!,
      total,
    });
  }

  return days;
}
private async getGrowthStats() {
  const today = new Date();

  const startCurrentWeek = new Date(today);
  startCurrentWeek.setDate(today.getDate() - 6);
  startCurrentWeek.setHours(0, 0, 0, 0);

  const startPreviousWeek = new Date(startCurrentWeek);
  startPreviousWeek.setDate(startPreviousWeek.getDate() - 7);

  const previousWeek =
    await this.prisma.solicitudes_restaurante.count({
      where: {
        created_at: {
          gte: startPreviousWeek,
          lt: startCurrentWeek,
        },
      },
    });

  const currentWeek =
    await this.prisma.solicitudes_restaurante.count({
      where: {
        created_at: {
          gte: startCurrentWeek,
        },
      },
    });

  let porcentaje = 0;

  if (previousWeek > 0) {
    porcentaje = Number(
      (
        ((currentWeek - previousWeek) / previousWeek) *
        100
      ).toFixed(2),
    );
  }

  return {
    semanaAnterior: previousWeek,
    semanaActual: currentWeek,
    diferencia: currentWeek - previousWeek,
    porcentaje,
  };
}
}