import { Injectable, NotFoundException } from '@nestjs/common';
import { estado_cuenta_rest } from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';
import { ExploreService } from '../../explore/services/explore.service';
import { FindPublicPromotionsDto } from '../dto/find-public-promotions.dto';
import {
  computeEstadoOperativo,
  getEcuadorTodayDateOnly,
} from '../../../core/common/utils/restaurant-status.util';

@Injectable()
export class PublicPromotionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exploreService: ExploreService,
  ) {}

  /**
   * Devuelve sólo las promociones activas de los mismos
   * restaurantes que devuelve Explore para los filtros recibidos.
   */
  async findAvailable(filters: FindPublicPromotionsDto) {
    const restaurants = await this.exploreService.findRestaurants(filters);
    const restaurantIds = restaurants.map((restaurant) => restaurant.id);

    if (restaurantIds.length === 0) {
      return [];
    }

    const today = getEcuadorTodayDateOnly();

    const promotions = await this.prisma.promociones.findMany({
      where: {
        restaurante_id: { in: restaurantIds },
        deleted_at: null,
        activa: true,
        fecha_inicio: { lte: today },
        fecha_fin: { gte: today },
        ...(filters.categoriaId ? { categoria_id: filters.categoriaId } : {}),
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
      },
      orderBy: [{ fecha_fin: 'asc' }, { created_at: 'desc' }],
    });

    const distancesByRestaurant = new Map(
      restaurants.map((restaurant) => [
        restaurant.id.toString(),
        restaurant.distancia,
      ]),
    );

    return promotions.map((promotion) =>
      this.serializePromotion(
        promotion,
        distancesByRestaurant.get(promotion.restaurante_id.toString()),
        false,
      ),
    );
  }

  /**
   * Una promoción sólo es pública mientras esté activa,
   * vigente y su restaurante permanezca activo.
   */
  async findOne(promotionId: bigint) {
    const today = getEcuadorTodayDateOnly();

    const promotion = await this.prisma.promociones.findFirst({
      where: {
        id: promotionId,
        deleted_at: null,
        activa: true,
        fecha_inicio: { lte: today },
        fecha_fin: { gte: today },
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
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promoción no encontrada.');
    }

    return this.serializePromotion(promotion, undefined, true);
  }

  /**
   * Serializa la respuesta pública de la promoción.
   *
   * Reemplaza la relación "restaurantes"
   * por "restaurante", recalcula el estado operativo real en base al
   * horario del restaurante y agrega la distancia cuando corresponda.
   */
  private serializePromotion<
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
  >(promotion: T, distance?: number, includeHorarios = false) {
    const { restaurantes, ...promotionData } = promotion;
    const { restaurante_horarios, ...restauranteData } = restaurantes;

    return {
      ...promotionData,
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