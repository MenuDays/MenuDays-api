import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { formatHour } from '../../../core/common/utils/format-hour.util';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { UpdateRestaurantCategoriesDto } from '../dto/update-restaurant-categories.dto';
import { CloudinaryFolder, CloudinaryService } from '../../../core/integrations/cloudinary/cloudinary.service';
@Injectable()
export class RestaurantService {
constructor(
  private readonly prisma: PrismaService,
  private readonly cloudinaryService: CloudinaryService,
) {}
  //función para obtener perfil de restaurant
  async getProfile(userId: bigint) {
    // Buscar el restaurante asociado al usuario autenticado.
    await this.findRestaurantByUserId(userId);

    // Obtener toda la información relacionada del restaurante.
    const restaurant = await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: BigInt(userId),
      },
      include: {
        ciudad: {
          include: {
            provincia: true,
          },
        },
        restaurante_telefonos: true,
        restaurante_redes_sociales: true,
        restaurante_horarios: {
          orderBy: {
            dia_semana: 'asc',
          },
        },
      },
    });

    if (!restaurant) {
      return null;
    }

    return {
  ...restaurant,

  restaurante_horarios: restaurant.restaurante_horarios.map((horario) => ({
    ...horario,
    hora_apertura: formatHour(horario.hora_apertura),
    hora_cierre: formatHour(horario.hora_cierre),
  })),

  ubicacion_lat: restaurant.ubicacion_lat?.toNumber() ?? null,
  ubicacion_lng: restaurant.ubicacion_lng?.toNumber() ?? null,
  calificacion_promedio:
    restaurant.calificacion_promedio?.toNumber() ?? null,

  ciudad: restaurant.ciudad
    ? {
        ...restaurant.ciudad,
        latitud: restaurant.ciudad.latitud?.toNumber() ?? null,
        longitud: restaurant.ciudad.longitud?.toNumber() ?? null,
      }
    : null,
};
  }

  //funcion de modificar perfil
  async updateProfile(
    userId: bigint,
    updateRestaurantDto: UpdateRestaurantDto,
  ) {
    // Verificar que el restaurante exista.
    const restaurant = await this.findRestaurantByUserId(userId);

    const ofreceDelivery =
      updateRestaurantDto.ofreceDelivery ?? restaurant.ofrece_delivery;

    const nombreDelivery =
      updateRestaurantDto.nombreDelivery ?? restaurant.nombre_delivery;

    if (ofreceDelivery && !nombreDelivery?.trim()) {
      throw new BadRequestException(
        'Debe indicar el nombre del servicio de delivery.',
      );
    }

    // TODO:
    // Validar que la ciudad exista en la base de datos
    // antes de actualizar el restaurante.

    // Actualizar la información del restaurante.
    await this.prisma.restaurantes.update({
      where: {
        id: restaurant.id,
      },
      data: {
        nombre_comercial: updateRestaurantDto.nombreComercial,
        descripcion: updateRestaurantDto.descripcion,
        direccion: updateRestaurantDto.direccion,
        ciudad_id: updateRestaurantDto.ciudadId,
        ubicacion_lat: updateRestaurantDto.ubicacionLat,
        ubicacion_lng: updateRestaurantDto.ubicacionLng,
        logo_url: updateRestaurantDto.logoUrl,
        portada_url: updateRestaurantDto.portadaUrl,
        ofrece_delivery: ofreceDelivery,
        nombre_delivery: ofreceDelivery ? nombreDelivery?.trim() : null,
      },
    });

    // Retornar el perfil actualizado.
    return this.getProfile(userId);
  }
  private async findRestaurantByUserId(userId: bigint) {
    const restaurant = await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: BigInt(userId),
      },
    });

    if (!restaurant) {
      throw new NotFoundException(
        'No se encontró un restaurante asociado al usuario.',
      );
    }

    return restaurant;
  }
  /**
   * Obtener las categorías seleccionadas por el restaurante.
   *
   * Se valida que el usuario tenga
   * un restaurante asociado.
   *
   * Se retornan las categorías con
   * la información de su ícono.
   */
  async getCategories(userId: bigint) {
    // Buscar restaurante.
    const restaurant = await this.findRestaurantByUserId(userId);

    // Obtener las categorías seleccionadas.
    const restaurantCategories =
      await this.prisma.restaurante_categoria.findMany({
        where: {
          restaurante_id: restaurant.id,
        },
        include: {
          categoria: {
            include: {
              iconos: true,
            },
          },
        },
        orderBy: {
          categoria_id: 'asc',
        },
      });

    // Retornar las categorías.
    return restaurantCategories.map(
      (restaurantCategory) => restaurantCategory.categoria,
    );
  }
  /**
   * Reemplazar las categorías seleccionadas por el restaurante.
   *
   * Se validan las categorías recibidas y
   * se reemplazan todas las relaciones existentes.
   *
   * Se retorna el listado actualizado.
   */
  async replaceCategories(
    userId: bigint,
    updateRestaurantCategoriesDto: UpdateRestaurantCategoriesDto,
  ) {
    // Buscar restaurante.
    const restaurant = await this.findRestaurantByUserId(userId);

    const { categoryIds } = updateRestaurantCategoriesDto;

    // Verificar que todas las categorías existan.
    const categories = await this.prisma.categorias.findMany({
      where: {
        id: {
          in: categoryIds.map((id) => BigInt(id)),
        },
      },
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('Una o más categorías no existen.');
    }

    // Reemplazar las categorías del restaurante.
    await this.prisma.$transaction(async (tx) => {
      // Eliminar relaciones existentes.
      await tx.restaurante_categoria.deleteMany({
        where: {
          restaurante_id: restaurant.id,
        },
      });

      // Crear nuevas relaciones.
      await tx.restaurante_categoria.createMany({
        data: categoryIds.map((categoryId) => ({
          restaurante_id: restaurant.id,
          categoria_id: BigInt(categoryId),
        })),
      });
    });

    // Retornar categorías actualizadas.
    return this.getCategories(userId);
  }
  /**
 * Obtener la información del dashboard del restaurante autenticado.
 */
async getDashboard(userId: bigint) {
  // Buscar restaurante.
  const restaurant = await this.findRestaurantByUserId(userId);

  const today = new Date();

  const [
    platosRegistrados,
    promocionesActivas,
    pedidosPendientes,
    menuPublicadoHoy,
  ] = await Promise.all([
    this.prisma.platos.count({
      where: {
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    }),

    this.prisma.promociones.count({
      where: {
        restaurante_id: restaurant.id,
        activa: true,
        deleted_at: null,
      },
    }),

    this.prisma.pedidos.count({
      where: {
        restaurante_id: restaurant.id,
        estado: 'pendiente',
      },
    }),

    this.prisma.menus_del_dia.findFirst({
      where: {
        restaurante_id: restaurant.id,
        estado: 'publicado',
        deleted_at: null,
        fecha_inicio: {
          lte: today,
        },
        fecha_fin: {
          gte: today,
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  return {
    restaurante: {
      id: Number(restaurant.id),
      nombreComercial: restaurant.nombre_comercial,
      logoUrl: restaurant.logo_url,
      portadaUrl: restaurant.portada_url,
      estadoOperativo: restaurant.estado_operativo,
    },

    resumen: {
      calificacionPromedio:
        restaurant.calificacion_promedio?.toNumber() ?? 0,

      cantidadResenas: restaurant.cantidad_resenas,

      platosRegistrados,

      promocionesActivas,

      pedidosPendientes,

      menuPublicadoHoy: !!menuPublicadoHoy,
    },

    estadisticas: {
      resenas: restaurant.cantidad_resenas,
      promocionesActivas,
      platosRegistrados,
    },
  };
}
/**
 * Obtener todas las reseñas del restaurante autenticado.
 *
 * Se valida que el usuario tenga
 * un restaurante asociado.
 *
 * Se retornan únicamente las
 * reseñas visibles junto con la
 * información del usuario que las realizó.
 */
async getReviews(userId: bigint) {
  // Buscar restaurante.
  const restaurant =
    await this.findRestaurantByUserId(userId);

  // Obtener reseñas.
  return await this.prisma.resenas.findMany({
    where: {
      restaurante_id: restaurant.id,
      estado: 'visible',
    },
    include: {
      usuarios: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          foto_perfil_url: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}
/**
 * Actualizar logo del restaurante.
 */
async uploadLogo(
  userId: bigint,
  file: Express.Multer.File,
) {
  const restaurant =
    await this.findRestaurantByUserId(userId);

  // Eliminar logo anterior si existe.
  if (restaurant.logo_url) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          restaurant.logo_url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si falla la eliminación no se cancela la subida.
    }
  }

  // Subir nuevo logo.
  const image =
    await this.cloudinaryService.uploadImage(
      file,
      CloudinaryFolder.RESTAURANTS,
    );

  // Guardar URL.
  await this.prisma.restaurantes.update({
    where: {
      id: restaurant.id,
    },
    data: {
      logo_url: image.secure_url,
    },
  });

  return {
    message:
      'Logo actualizado correctamente.',
    logo_url: image.secure_url,
  };
}
/**
 * Actualizar portada del restaurante.
 */
async uploadCover(
  userId: bigint,
  file: Express.Multer.File,
) {
  const restaurant =
    await this.findRestaurantByUserId(userId);

  // Eliminar portada anterior si existe.
  if (restaurant.portada_url) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          restaurant.portada_url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si falla la eliminación no se cancela la subida.
    }
  }

  // Subir nueva portada.
  const image =
    await this.cloudinaryService.uploadImage(
      file,
      CloudinaryFolder.RESTAURANTS,
    );

  // Guardar URL.
  await this.prisma.restaurantes.update({
    where: {
      id: restaurant.id,
    },
    data: {
      portada_url: image.secure_url,
    },
  });

  return {
    message:
      'Portada actualizada correctamente.',
    portada_url: image.secure_url,
  };
}
}
