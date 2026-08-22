import { Injectable, NotFoundException } from '@nestjs/common';
import { estado_cuenta_rest, estado_publicacion } from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';
import { ExploreService } from '../../explore/services/explore.service';
import { FindPublicMenusDto } from '../dto/find-public-menus.dto';
import {
  computeEstadoOperativo,
  getEcuadorTodayDateOnly,
} from '../../../core/common/utils/restaurant-status.util';

// getEcuadorTodayDateOnly() ya resuelve el día calendario correcto en
// Ecuador -- de ahí se puede derivar el día de la semana sin volver a
// tocar zonas horarias. getUTCDay() da 0=Domingo..6=Sábado (estándar
// JS); se convierte al mismo criterio que restaurante_horarios.dia_semana
// y menus_del_dia.dias_semana (1=Lunes..7=Domingo).
function getEcuadorDiaSemana(todayDateOnly: Date): number {
  const jsDay = todayDateOnly.getUTCDay();
  return jsDay === 0 ? 7 : jsDay;
}

@Injectable()
export class PublicMenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exploreService: ExploreService,
  ) {}

  /**
   * Devuelve sólo los menús vigentes y publicados de los mismos
   * restaurantes que devuelve Explore para los filtros recibidos.
   */
  async findAvailable(filters: FindPublicMenusDto) {
    const restaurants = await this.exploreService.findRestaurants({
      ...filters,
      search: undefined,
    });

    const restaurantIds = restaurants.map((restaurant) => restaurant.id);

    if (restaurantIds.length === 0) {
      return [];
    }

    const today = getEcuadorTodayDateOnly();
    const todayDiaSemana = getEcuadorDiaSemana(today);

    const menus = await this.prisma.menus_del_dia.findMany({
      where: {
        restaurante_id: { in: restaurantIds },
        deleted_at: null,
        estado: estado_publicacion.publicado,
        fecha_inicio: { lte: today },
        fecha_fin: { gte: today },
        // Un menú "semanal" además tiene que caer en el día de la
        // semana de hoy -- si no es semanal, esta condición no aplica.
        OR: [
          { tipo_programacion: { not: 'semanal' } },
          { dias_semana: { has: todayDiaSemana } },
        ],

        // Para menús públicos, "search" busca por el nombre del menú del
        // día (ANTES este filtro no se aplicaba: se le pasaba search:undefined
        // a Explore -a propósito, para no filtrar restaurantes por nombre acá-
        // pero nunca se reaplicaba sobre menus_del_dia, así que el buscador
        // de la pantalla "Menús" no filtraba nada).
        ...(filters.search
          ? {
              nombre: {
                contains: filters.search,
                mode: 'insensitive',
              },
            }
          : {}),

        ...(filters.categoriaId ? { categoria_id: filters.categoriaId } : {}),
        ...(filters.tag ? { tags: { has: filters.tag } } : {}),
        restaurantes: {
          deleted_at: null,
          estado_cuenta: estado_cuenta_rest.activo,
        },
      },
      include: {
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            logo_url: true,
            estado_operativo: true,
            restaurante_horarios: true,
            calificacion_promedio: true,
            cantidad_resenas: true,
          },
        },
        categorias: true,
        menu_colecciones: true,
      },
      orderBy: [{ fecha_fin: 'asc' }, { created_at: 'desc' }],
    });

    const distancesByRestaurant = new Map(
      restaurants.map((restaurant) => [
        restaurant.id.toString(),
        restaurant.distancia,
      ]),
    );

    return menus.map((menu) =>
      this.serializeMenu(
        menu,
        distancesByRestaurant.get(menu.restaurante_id.toString()),
        false,
      ),
    );
  }

  /**
   * Un menú sólo es público mientras esté publicado, vigente y su
   * restaurante permanezca activo. No hay relación menú-platos en Prisma.
   */
  async findOne(menuId: bigint) {
    const today = getEcuadorTodayDateOnly();
    const todayDiaSemana = getEcuadorDiaSemana(today);

    const menu = await this.prisma.menus_del_dia.findFirst({
      where: {
        id: menuId,
        deleted_at: null,
        estado: estado_publicacion.publicado,
        fecha_inicio: { lte: today },
        fecha_fin: { gte: today },
        OR: [
          { tipo_programacion: { not: 'semanal' } },
          { dias_semana: { has: todayDiaSemana } },
        ],
        restaurantes: {
          deleted_at: null,
          estado_cuenta: estado_cuenta_rest.activo,
        },
      },
      include: {
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            descripcion: true,
            direccion: true,
            logo_url: true,
            portada_url: true,
            ubicacion_lat: true,
            ubicacion_lng: true,
            estado_operativo: true,
            calificacion_promedio: true,
            cantidad_resenas: true,
            ciudad: {
              select: {
                id: true,
                nombre: true,
                provincia: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
            restaurante_horarios: {
              orderBy: {
                dia_semana: 'asc',
              },
            },
          },
        },
        categorias: true,
        menu_colecciones: true,
      },
    });

    if (!menu) {
      throw new NotFoundException('Menú no encontrado.');
    }

    return this.serializeMenu(menu, undefined, true);
  }

  /**
   * Autocompletado de tags para el buscador de "Explorar": tags que
   * algún restaurante haya usado en un menú vigente, filtrados por
   * substring (case-insensitive). No hay índice GIN sobre `tags` así
   * que esto hace un unnest + scan -- aceptable dado el volumen actual
   * de menus_del_dia; si crece, se puede sumar un índice GIN.
   */
  async findMatchingTags(search: string): Promise<string[]> {
    const trimmed = search.trim();
    if (trimmed.length === 0) {
      return [];
    }

    const rows = await this.prisma.$queryRaw<{ tag: string }[]>`
      SELECT DISTINCT tag
      FROM menus_del_dia m
      CROSS JOIN LATERAL unnest(m.tags) AS tag
      INNER JOIN restaurantes r ON r.id = m.restaurante_id
      WHERE m.deleted_at IS NULL
        AND m.estado = 'publicado'::estado_publicacion
        AND m.fecha_fin >= CURRENT_DATE
        AND r.deleted_at IS NULL
        AND r.estado_cuenta = 'activo'::estado_cuenta_rest
        AND tag ILIKE ${`%${trimmed}%`}
      ORDER BY tag ASC
      LIMIT 20
    `;

    return rows.map((row) => row.tag);
  }

  private serializeMenu<
    T extends {
      restaurantes: {
        estado_operativo: 'abierto' | 'cerrado' | 'cerrado_temporal' | 'vacaciones';
        restaurante_horarios: {
          dia_semana: number;
          hora_apertura: Date | null;
          hora_cierre: Date | null;
          cerrado: boolean;
        }[];
      } & Record<string, unknown>;
    },
  >(menu: T, distance?: number, includeHorarios = false) {
    const { restaurantes, ...menuData } = menu;
    const { restaurante_horarios, ...restauranteData } = restaurantes;

    return {
      ...menuData,
      restaurante: {
        ...restauranteData,
        estado_operativo: computeEstadoOperativo(
          restaurantes.estado_operativo,
          restaurante_horarios,
        ),
        ...(includeHorarios ? { restaurante_horarios } : {}),
      },
      ...(distance !== undefined ? { distancia: distance } : {}),
    };
  }
}