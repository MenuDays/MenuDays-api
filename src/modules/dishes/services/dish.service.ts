import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { estado_disponibilidad } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';

import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

import { CreateDishDto } from '../dto/create-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';

@Injectable()
export class DishService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

/**
 * Crear un plato.
 *
 * Se valida que el usuario
 * tenga un restaurante asociado.
 *
 * Se valida que exista la
 * categoría seleccionada.
 *
 * Se valida que se envíe
 * una imagen.
 *
 * Se sube la imagen a
 * Cloudinary y se crea
 * el plato.
 */
async create(
  userId: bigint,
  createDishDto: CreateDishDto,
  file: Express.Multer.File,
) {
  // Buscar el restaurante del usuario autenticado.
  const restaurant =
    await this.findRestaurantByUserId(
      userId,
    );

  // Validar que exista la categoría.
  await this.validateCategory(
    createDishDto.categoriaId,
  );

  // Validar que se haya enviado una imagen.
  if (!file) {
    throw new BadRequestException(
      'Debe seleccionar una imagen.',
    );
  }

  // Subir imagen a Cloudinary.
  let imageUrl: string;

  try {
    const uploadedImage =
      await this.cloudinaryService.uploadImage(
        file,
        CloudinaryFolder.DISHES,
      );

    imageUrl = uploadedImage.secure_url;
  } catch {
    throw new InternalServerErrorException(
      'Error al subir la imagen a Cloudinary.',
    );
  }

  // Crear plato.
  return this.prisma.platos.create({
    data: {
      restaurante_id: restaurant.id,

      categoria_id:
        createDishDto.categoriaId,

      nombre:
        createDishDto.nombre,

      descripcion:
        createDishDto.descripcion,

      precio:
        createDishDto.precio,

      estado:
  createDishDto.estado ??
  estado_disponibilidad.disponible,

      activo:
        createDishDto.activo ??
        true,

      destacado:
        createDishDto.destacado ??
        false,

      en_oferta:
        createDishDto.enOferta ??
        false,

      precio_oferta:
        createDishDto.precioOferta,

      plato_imagenes: {
  create: {
    url: imageUrl,
    orden: 0,
  },
},
    },
  });
}

  /**
 * Obtener todos los platos
 * del restaurante autenticado.
 */
async findAll(
  userId: bigint,
) {
  // Buscar el restaurante del usuario autenticado.
  console.log('Service userId:', userId);
  const restaurant =
    await this.findRestaurantByUserId(
      userId,
    );

  // Obtener todos los platos del restaurante.
  return this.prisma.platos.findMany({
    where: {
      restaurante_id: restaurant.id,
    },
    include: {
  categorias: true,
  plato_imagenes: {
    orderBy: {
      orden: 'asc',
    },
  },
},
    orderBy: {
      created_at: 'desc',
    },
  });
}

  /**
 * Obtener un plato específico
 * verificando que pertenezca
 * al restaurante autenticado.
 */
async findOne(
  userId: bigint,
  dishId: number,
) {
  // Buscar el restaurante del usuario autenticado.
  const restaurant =
    await this.findRestaurantByUserId(
      userId,
    );

  // Buscar el plato del restaurante.
  await this.findDishById(
    restaurant.id,
    dishId,
  );

  // Obtener el detalle del plato.
  return this.prisma.platos.findFirst({
    where: {
      id: BigInt(dishId),
      restaurante_id: restaurant.id,
    },
    include: {
  categorias: true,
  plato_imagenes: {
    orderBy: {
      orden: 'asc',
    },
  },
},
  });
}

/**
 * Actualizar un plato.
 *
 * Si llega una nueva imagen:
 * - eliminar la anterior
 * - subir la nueva
 *
 * Si no llega imagen:
 * - mantener la existente.
 *
 * Se permite modificar:
 * nombre,
 * descripción,
 * precio,
 * categoría,
 * estado
 * y activo.
 */
async update(
  userId: bigint,
  dishId: number,
  updateDishDto: UpdateDishDto,
  file?: Express.Multer.File,
) {
  // Buscar el restaurante del usuario autenticado.
  const restaurant =
    await this.findRestaurantByUserId(
      userId,
    );

  // Buscar el plato junto con su imagen.
  const dish =
    await this.prisma.platos.findFirst({
      where: {
        id: BigInt(dishId),
        restaurante_id: restaurant.id,
      },
      include: {
        plato_imagenes: {
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });

  if (!dish) {
    throw new NotFoundException(
      'No se encontró el plato.',
    );
  }

  // Validar la categoría si se desea modificar.
  if (updateDishDto.categoriaId) {
    await this.validateCategory(
      updateDishDto.categoriaId,
    );
  }

  // Si llega una nueva imagen.
  if (file) {
    try {
      // Eliminar imagen anterior de Cloudinary.
      if (dish.plato_imagenes.length > 0) {
        const previousImage =
          dish.plato_imagenes[0];

        const publicId =
          this.cloudinaryService.extractPublicId(
            previousImage.url,
          );

        await this.cloudinaryService.deleteImage(
          publicId,
        );
      }

      // Subir nueva imagen.
      const uploadedImage =
        await this.cloudinaryService.uploadImage(
          file,
          CloudinaryFolder.DISHES,
        );

      // Actualizar plato e imagen.
      await this.prisma.$transaction([
        this.prisma.plato_imagenes.deleteMany({
          where: {
            plato_id: dish.id,
          },
        }),

        this.prisma.platos.update({
          where: {
            id: dish.id,
          },
          data: {
            nombre:
              updateDishDto.nombre ??
              dish.nombre,

            descripcion:
              updateDishDto.descripcion ??
              dish.descripcion,

            precio:
              updateDishDto.precio ??
              dish.precio,

            categoria_id:
              updateDishDto.categoriaId ??
              dish.categoria_id,

            estado:
              updateDishDto.estado ??
              dish.estado,

            activo:
              updateDishDto.activo ??
              dish.activo,

            destacado:
              updateDishDto.destacado ??
              dish.destacado,

            en_oferta:
              updateDishDto.enOferta ??
              dish.en_oferta,

            precio_oferta:
              updateDishDto.precioOferta !== undefined
                ? updateDishDto.precioOferta
                : dish.precio_oferta,

            updated_at: new Date(),
          },
        }),

        this.prisma.plato_imagenes.create({
          data: {
            plato_id: dish.id,
            url: uploadedImage.secure_url,
            orden: 0,
          },
        }),
      ]);
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar la imagen del plato.',
      );
    }
  } else {
    // Actualizar solamente los datos del plato.
    await this.prisma.platos.update({
      where: {
        id: dish.id,
      },
      data: {
        nombre:
          updateDishDto.nombre ??
          dish.nombre,

        descripcion:
          updateDishDto.descripcion ??
          dish.descripcion,

        precio:
          updateDishDto.precio ??
          dish.precio,

        categoria_id:
          updateDishDto.categoriaId ??
          dish.categoria_id,

        estado:
          updateDishDto.estado ??
          dish.estado,

        activo:
          updateDishDto.activo ??
          dish.activo,

        destacado:
          updateDishDto.destacado ??
          dish.destacado,

        en_oferta:
          updateDishDto.enOferta ??
          dish.en_oferta,

        precio_oferta:
          updateDishDto.precioOferta !== undefined
            ? updateDishDto.precioOferta
            : dish.precio_oferta,

        updated_at: new Date(),
      },
    });
  }

  // Retornar el plato actualizado.
  return this.findOne(
    userId,
    dishId,
  );
}
  /**
 * Eliminar un plato.
 *
 * Se valida que el plato
 * pertenezca al restaurante.
 *
 * Se elimina la imagen de
 * Cloudinary y luego se
 * elimina definitivamente
 * de la base de datos.
 */
async remove(
  userId: bigint,
  dishId: number,
) {
  // Buscar el restaurante del usuario autenticado.
  const restaurant =
    await this.findRestaurantByUserId(
      userId,
    );

  // Buscar el plato junto con su imagen.
  const dish =
    await this.prisma.platos.findFirst({
      where: {
        id: BigInt(dishId),
        restaurante_id: restaurant.id,
      },
      include: {
        plato_imagenes: true,
      },
    });

  if (!dish) {
    throw new NotFoundException(
      'No se encontró el plato.',
    );
  }

  // Eliminar la imagen de Cloudinary.
  if (dish.plato_imagenes.length > 0) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          dish.plato_imagenes[0].url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si falla Cloudinary no impedimos
      // eliminar el registro de la BD.
    }
  }

  // Eliminar el plato.
  // Las imágenes asociadas se eliminan
  // automáticamente por Cascade.
  await this.prisma.platos.delete({
    where: {
      id: dish.id,
    },
  });

  return {
    message:
      'Plato eliminado correctamente.',
  };
}

  /**
 * Buscar el restaurante
 * asociado al usuario.
 *
 * Lanza una excepción si
 * no existe.
 */
private async findRestaurantByUserId(
  userId: bigint,
) {
  const restaurant =
    await this.prisma.restaurantes.findUnique({
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
 * Buscar un plato
 * perteneciente al
 * restaurante.
 *
 * Lanza una excepción si
 * no existe.
 */
private async findDishById(
  restaurantId: bigint,
  dishId: number,
) {
  const dish =
    await this.prisma.platos.findFirst({
      where: {
        id: BigInt(dishId),
        restaurante_id: restaurantId,
      },
    });

  if (!dish) {
    throw new NotFoundException(
      'No se encontró el plato.',
    );
  }

  return dish;
}

  /**
 * Validar que la categoría
 * exista en la base de datos.
 *
 * Lanza una excepción si
 * no existe.
 */
private async validateCategory(
  categoryId: number,
) {
  const category =
    await this.prisma.categorias.findUnique({
      where: {
        id: BigInt(categoryId),
      },
    });

  if (!category) {
    throw new NotFoundException(
      'No se encontró la categoría.',
    );
  }

  return category;
}
}