import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class RestaurantPublicService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener toda la información pública
   * de un restaurante.
   *
   * Devuelve:
   * - Perfil
   * - Horarios
   * - Teléfonos
   * - Redes sociales
   * - Categorías
   * - Galería
   * - Menús publicados
   * - Platos activos
   * - Promociones activas
   */
  async findOne(restaurantId: bigint) {
    // Validar que exista el restaurante.

    const restaurant = await this.findRestaurantById(restaurantId);

    // Obtener la galería.

    const gallery = await this.getGallery(restaurantId);

    // Obtener los menús publicados.

    const menus = await this.getMenus(restaurantId);

    // Obtener los platos activos.

    const dishes = await this.getDishes(restaurantId);

    // Obtener las promociones activas.

    const promotions = await this.getPromotions(restaurantId);

    // Obtener las categorías.

    const categories = await this.getCategories(restaurantId);

    // Construir la respuesta.

    const response = this.buildResponse(
      restaurant,
      gallery,
      menus,
      dishes,
      promotions,
      categories,
    );

    // Retornar resultado.

    return response;
  }

  // ======================================================
  // Helpers privados
  // ======================================================

  /**
   * Buscar un restaurante por ID.
   *
   * Incluye toda la información
   * básica del perfil.
   *
   * Lanza NotFoundException
   * si el restaurante no existe.
   */
  private async findRestaurantById(restaurantId: bigint) {
    // Buscar restaurante.

    const restaurant = await this.prisma.restaurantes.findUnique({
      where: {
        id: restaurantId,
        deleted_at: null,
        estado_cuenta: 'activo',
      },
      include: {
        ciudad: {
          include: {
            provincia: true,
          },
        },
        restaurante_horarios: {
          orderBy: {
            dia_semana: 'asc',
          },
        },
        restaurante_telefonos: true,
        restaurante_redes_sociales: true,
      },
    });

    // Validar existencia.

    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado.');
    }

    // Retornar restaurante.

    return restaurant;
  }
  /**
   * Obtener la galería pública
   * del restaurante.
   */
  private async getGallery(restaurantId: bigint) {
    // Obtener imágenes.

    const gallery = await this.prisma.galeria_imagenes.findMany({
      where: {
        restaurante_id: restaurantId,
      },
      orderBy: [
        {
          es_portada: 'desc',
        },
        {
          orden: 'asc',
        },
        {
          created_at: 'asc',
        },
      ],
    });

    // Retornar galería.

    return gallery;
  }

  /**
   * Obtener los menús
   * publicados del restaurante.
   */
  private async getMenus(restaurantId: bigint) {
    // Buscar menús.

    const menus = await this.prisma.menus_del_dia.findMany({
      where: {
        restaurante_id: restaurantId,
        deleted_at: null,
        estado: 'publicado',
      },
      orderBy: [
        {
          fecha_inicio: 'desc',
        },
        {
          created_at: 'desc',
        },
      ],
    });

    // Retornar.

    return menus;
  }
  /**
   * Obtener los platos
   * visibles del restaurante.
   */
  private async getDishes(restaurantId: bigint) {
    // Buscar platos.

    const dishes = await this.prisma.platos.findMany({
      where: {
        restaurante_id: restaurantId,
        activo: true,
        deleted_at: null,
      },
      include: {
        categorias: true,
        plato_imagenes: {
          orderBy: {
            orden: 'asc',
          },
        },
      },
      orderBy: [
        {
          orden: 'asc',
        },
        {
          created_at: 'desc',
        },
      ],
    });

    // Retornar.

    return dishes;
  }
  /**
   * Obtener las promociones
   * activas del restaurante.
   */
  private async getPromotions(restaurantId: bigint) {
    // Buscar promociones.

    const promotions = await this.prisma.promociones.findMany({
      where: {
        restaurante_id: restaurantId,
        activa: true,
        deleted_at: null,
      },
      orderBy: [
        {
          fecha_inicio: 'desc',
        },
        {
          created_at: 'desc',
        },
      ],
    });

    // Retornar.

    return promotions;
  }

  /**
   * Obtener las categorías
   * del restaurante.
   */
  private async getCategories(restaurantId: bigint) {
    // Buscar categorías.

    const categories = await this.prisma.restaurante_categoria.findMany({
      where: {
        restaurante_id: restaurantId,
      },
      include: {
        categoria: {
          include: {
            iconos: true,
          },
        },
      },
      orderBy: {
        categoria: {
          nombre: 'asc',
        },
      },
    });

    // Retornar.

    return categories;
  }
  /**
   * Construir la respuesta
   * pública del restaurante.
   */
  private buildResponse(
    restaurant: any,
    gallery: any,
    menus: any,
    dishes: any,
    promotions: any,
    categories: any,
  ) {
    // Armar objeto final.

    const response = {
      id: restaurant.id,
      nombreComercial: restaurant.nombre_comercial,
      descripcion: restaurant.descripcion,
      logoUrl: restaurant.logo_url,
      portadaUrl: restaurant.portada_url,

      direccion: restaurant.direccion,

      ciudad: restaurant.ciudad,

      ubicacion: {
        lat: restaurant.ubicacion_lat,
        lng: restaurant.ubicacion_lng,
      },

      estadoOperativo: restaurant.estado_operativo,

      ofreceDelivery: restaurant.ofrece_delivery,
      nombreDelivery: restaurant.nombre_delivery,

      calificacionPromedio: restaurant.calificacion_promedio,
      cantidadResenas: restaurant.cantidad_resenas,

      horarios: restaurant.restaurante_horarios,

      telefonos: restaurant.restaurante_telefonos,

      redesSociales: restaurant.restaurante_redes_sociales,

      categorias: categories,

      galeria: gallery,

      menus,

      platos: dishes,

      promociones: promotions,
    };

    // Retornar respuesta.

    return response;
  }
}
