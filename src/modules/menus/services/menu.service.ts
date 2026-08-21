import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import {
  CloudinaryFolder,
  CloudinaryService,
} from '../../../core/integrations/cloudinary/cloudinary.service';

import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
  userId: bigint,
  createMenuDto: CreateMenuDto,
  file: Express.Multer.File,
) {
  // Buscar el restaurante del usuario autenticado
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Si se envía una colección, validar que exista y pertenezca a este
  // mismo restaurante (una colección de Restaurante A nunca debe poder
  // asignarse a un menú de Restaurante B).
  if (createMenuDto.coleccionId !== undefined) {
    await this.validateCollectionOwnership(
      restaurant.id,
      createMenuDto.coleccionId,
    );
  }

  // La foto es opcional: si no llega, el menú se crea sin foto_url
  // (el front ya sabe mostrar un placeholder cuando es null).
  let imageUrl: string | undefined;

  if (file) {
    try {
      const uploadedImage =
        await this.cloudinaryService.uploadImage(
          file,
          CloudinaryFolder.MENUS,
        );

      imageUrl = uploadedImage.secure_url;
    } catch {
      throw new InternalServerErrorException(
        'Error al subir la imagen a Cloudinary.',
      );
    }
  }

  // Crear menú
  const menu =
    await this.prisma.menus_del_dia.create({
      data: {
        restaurante_id: restaurant.id,

        nombre: createMenuDto.nombre,
        categoria_id: BigInt(createMenuDto.categoriaId),
        coleccion_id:
          createMenuDto.coleccionId !== undefined
            ? BigInt(createMenuDto.coleccionId)
            : undefined,
        descripcion:
          createMenuDto.descripcion,

        precio: createMenuDto.precio,

        foto_url: imageUrl,

        estado:
  createMenuDto.estado ??
  'programado',

        fecha_inicio: new Date(
          createMenuDto.fechaInicio,
        ),

        fecha_fin: new Date(
          createMenuDto.fechaFin,
        ),

        componente_entrada: createMenuDto.componenteEntrada,
        componente_sopa: createMenuDto.componenteSopa,
        componente_plato_fuerte: createMenuDto.componentePlatoFuerte,
        componente_jugo: createMenuDto.componenteJugo,
        componente_postre: createMenuDto.componentePostre,
        tags: createMenuDto.tags ?? [],
        tipo_programacion: createMenuDto.tipoProgramacion ?? 'fecha',
        dias_semana: createMenuDto.diasSemana ?? [],
      },
    });

  return this.serializeMenu(menu);
}

/**
 * Obtener todos los menús
 * del restaurante autenticado.
 */
async findAll(userId: bigint) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Obtener menús
  const menus = await this.prisma.menus_del_dia.findMany({
  where: {
    restaurante_id: restaurant.id,
    deleted_at: null,
  },
  include: {
    menu_colecciones: true,
  },
  orderBy: {
    created_at: 'desc',
  },
});

return menus.map((menu) => this.serializeMenu(menu));
}
  /**
 * Obtener un menú específico
 * verificando que pertenezca
 * al restaurante autenticado.
 */
async findOne(
  userId: bigint,
  menuId: number,
) {
  // Buscar restaurante del usuario autenticado
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
      include: {
        menu_colecciones: true,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  return this.serializeMenu(menu);
}

  /**
 * Actualizar un menú.
 *
 * Si llega una nueva imagen:
 * - subirla a Cloudinary
 * - reemplazar la URL anterior
 *
 * Si no llega imagen:
 * - mantener la existente.
 */
async update(
  userId: bigint,
  menuId: number,
  updateMenuDto: UpdateMenuDto,
  file?: Express.Multer.File,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  // Si se envía una colección, validar que exista y pertenezca a este
  // mismo restaurante.
  if (updateMenuDto.coleccionId !== undefined) {
    await this.validateCollectionOwnership(
      restaurant.id,
      updateMenuDto.coleccionId,
    );
  }

  // Mantener imagen actual por defecto
  let imageUrl = menu.foto_url;

  // Si llega una nueva imagen
  if (file) {
    try {
      // Eliminar imagen anterior
      if (menu.foto_url) {
        const publicId =
          this.cloudinaryService.extractPublicId(
            menu.foto_url,
          );

        await this.cloudinaryService.deleteImage(
          publicId,
        );
      }

      // Subir nueva imagen
      const uploadedImage =
        await this.cloudinaryService.uploadImage(
          file,
          CloudinaryFolder.MENUS,
        );

      imageUrl = uploadedImage.secure_url;
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar la imagen del menú.',
      );
    }
  }

  // Actualizar menú
  const updatedMenu =
  await this.prisma.menus_del_dia.update({
    where: {
      id: menu.id,
    },
    include: {
      menu_colecciones: true,
    },
    data: {
      nombre:
        updateMenuDto.nombre ?? menu.nombre,

      categoria_id:
      updateMenuDto.categoriaId !== undefined
    ? BigInt(updateMenuDto.categoriaId)
    : menu.categoria_id,
      coleccion_id:
      updateMenuDto.coleccionId !== undefined
    ? BigInt(updateMenuDto.coleccionId)
    : menu.coleccion_id,
      descripcion:
        updateMenuDto.descripcion ??
        menu.descripcion,

      precio:
        updateMenuDto.precio ?? menu.precio,

      foto_url: imageUrl,

      estado:
  updateMenuDto.estado ??
  menu.estado,
      fecha_inicio: updateMenuDto.fechaInicio
        ? new Date(updateMenuDto.fechaInicio)
        : menu.fecha_inicio,

      fecha_fin: updateMenuDto.fechaFin
        ? new Date(updateMenuDto.fechaFin)
        : menu.fecha_fin,

      componente_entrada:
        updateMenuDto.componenteEntrada !== undefined
          ? updateMenuDto.componenteEntrada
          : menu.componente_entrada,
      componente_sopa:
        updateMenuDto.componenteSopa !== undefined
          ? updateMenuDto.componenteSopa
          : menu.componente_sopa,
      componente_plato_fuerte:
        updateMenuDto.componentePlatoFuerte !== undefined
          ? updateMenuDto.componentePlatoFuerte
          : menu.componente_plato_fuerte,
      componente_jugo:
        updateMenuDto.componenteJugo !== undefined
          ? updateMenuDto.componenteJugo
          : menu.componente_jugo,
      componente_postre:
        updateMenuDto.componentePostre !== undefined
          ? updateMenuDto.componentePostre
          : menu.componente_postre,
      tags: updateMenuDto.tags ?? menu.tags,
      tipo_programacion:
        updateMenuDto.tipoProgramacion ?? menu.tipo_programacion,
      dias_semana: updateMenuDto.diasSemana ?? menu.dias_semana,

      updated_at: new Date(),
    },
  });

return this.serializeMenu(updatedMenu);
}

 /**
 * Eliminar un menú.
 *
 * Se valida que el menú
 * pertenezca al restaurante.
 *
 * Se elimina la imagen de
 * Cloudinary y luego el
 * registro de la base de datos.
 */
async remove(
  userId: bigint,
  menuId: number,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  // Eliminar imagen de Cloudinary
  if (menu.foto_url) {
    try {
      const publicId =
        this.cloudinaryService.extractPublicId(
          menu.foto_url,
        );

      await this.cloudinaryService.deleteImage(
        publicId,
      );
    } catch {
      // Si falla Cloudinary no impedimos
      // eliminar el registro de la BD.
    }
  }

  // Eliminar de la base de datos
  await this.prisma.menus_del_dia.delete({
    where: {
      id: menu.id,
    },
  });

  return {
    message:
      'Menú eliminado correctamente.',
  };
}
private serializeMenu(menu: any) {
  return {
    ...menu,
    precio: menu.precio?.toNumber() ?? null,
  };
}

/**
 * Valida que una colección exista y pertenezca al restaurante dado.
 * Evita que un restaurante asigne un menú a una colección ajena
 * adivinando/enviando un ID de otro restaurante.
 */
private async validateCollectionOwnership(
  restaurantId: bigint,
  collectionId: number,
) {
  const coleccion = await this.prisma.menu_colecciones.findFirst({
    where: {
      id: BigInt(collectionId),
      restaurante_id: restaurantId,
    },
  });

  if (!coleccion) {
    throw new NotFoundException(
      'La colección indicada no existe o no pertenece a este restaurante.',
    );
  }
}
/**
 * Publicar u ocultar
 * un menú del día.
 */
async toggle(
  userId: bigint,
  menuId: number,
) {
  // Buscar restaurante
  const restaurant =
    await this.prisma.restaurantes.findUnique({
      where: {
        usuario_id: userId,
      },
    });

  if (!restaurant) {
    throw new NotFoundException(
      'No se encontró el restaurante.',
    );
  }

  // Buscar menú
  const menu =
    await this.prisma.menus_del_dia.findFirst({
      where: {
        id: BigInt(menuId),
        restaurante_id: restaurant.id,
        deleted_at: null,
      },
    });

  if (!menu) {
    throw new NotFoundException(
      'No se encontró el menú.',
    );
  }

  // Alternar estado
  const nuevoEstado =
    menu.estado === 'publicado'
      ? 'oculto'
      : 'publicado';

  const updatedMenu =
    await this.prisma.menus_del_dia.update({
      where: {
        id: menu.id,
      },
      data: {
        estado: nuevoEstado,
        updated_at: new Date(),
      },
    });

  return {
    message:
      updatedMenu.estado === 'publicado'
        ? 'Menú publicado correctamente.'
        : 'Menú ocultado correctamente.',
    estado: updatedMenu.estado,
  };
}
}