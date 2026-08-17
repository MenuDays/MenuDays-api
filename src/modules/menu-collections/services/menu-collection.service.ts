import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

import { CreateMenuCollectionDto } from '../dto/create-menu-collection.dto';
import { UpdateMenuCollectionDto } from '../dto/update-menu-collection.dto';

// Las 4 colecciones que debe tener todo restaurante desde el día 1. Se usan
// tanto para restaurantes nuevos (ver approveRequest en
// restaurant-requests-admin.service.ts) como para el backfill de
// restaurantes existentes (ver scripts/backfill-menu-collections.ts).
export const DEFAULT_MENU_COLLECTIONS = [
  'Entradas',
  'Sopas',
  'Menú Infantil',
  'Postres',
];

@Injectable()
export class MenuCollectionService {
  constructor(private readonly prisma: PrismaService) {}

  private async findRestaurantByUserId(userId: bigint) {
    const restaurant = await this.prisma.restaurantes.findUnique({
      where: { usuario_id: userId },
    });

    if (!restaurant) {
      throw new NotFoundException('No se encontró el restaurante.');
    }

    return restaurant;
  }

  /**
   * Colecciones del restaurante autenticado, ordenadas por `orden`.
   * Incluye la cantidad de menús vigentes (no borrados) en cada una para
   * que el frontend pueda mostrar el contador sin pedir cada menú aparte.
   */
  async findAll(userId: bigint) {
    const restaurant = await this.findRestaurantByUserId(userId);

    const colecciones = await this.prisma.menu_colecciones.findMany({
      where: { restaurante_id: restaurant.id, activo: true },
      orderBy: { orden: 'asc' },
      include: {
        _count: {
          select: { menus_del_dia: { where: { deleted_at: null } } },
        },
      },
    });

    return colecciones;
  }

  /**
   * Crea una colección nueva para el restaurante autenticado.
   *
   * El chequeo de duplicado es case-insensitive (mejor UX que solo confiar
   * en el índice único de Postgres, que es case-sensitive) -- el índice
   * único sigue como última red de seguridad ante condiciones de carrera.
   */
  async create(userId: bigint, dto: CreateMenuCollectionDto) {
    const restaurant = await this.findRestaurantByUserId(userId);

    const existing = await this.prisma.menu_colecciones.findFirst({
      where: {
        restaurante_id: restaurant.id,
        nombre: { equals: dto.nombre, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Ya existe una colección con ese nombre.',
      );
    }

    const ultimaColeccion = await this.prisma.menu_colecciones.findFirst({
      where: { restaurante_id: restaurant.id },
      orderBy: { orden: 'desc' },
      select: { orden: true },
    });

    const coleccion = await this.prisma.menu_colecciones.create({
      data: {
        restaurante_id: restaurant.id,
        nombre: dto.nombre,
        orden: (ultimaColeccion?.orden ?? -1) + 1,
      },
    });

    return coleccion;
  }

  async update(userId: bigint, collectionId: number, dto: UpdateMenuCollectionDto) {
    const restaurant = await this.findRestaurantByUserId(userId);

    const coleccion = await this.prisma.menu_colecciones.findFirst({
      where: { id: BigInt(collectionId), restaurante_id: restaurant.id },
    });

    if (!coleccion) {
      throw new NotFoundException('No se encontró la colección.');
    }

    if (dto.nombre && dto.nombre.toLowerCase() !== coleccion.nombre.toLowerCase()) {
      const duplicada = await this.prisma.menu_colecciones.findFirst({
        where: {
          restaurante_id: restaurant.id,
          nombre: { equals: dto.nombre, mode: 'insensitive' },
          NOT: { id: coleccion.id },
        },
      });

      if (duplicada) {
        throw new ConflictException(
          'Ya existe una colección con ese nombre.',
        );
      }
    }

    const actualizada = await this.prisma.menu_colecciones.update({
      where: { id: coleccion.id },
      data: {
        nombre: dto.nombre ?? coleccion.nombre,
        updated_at: new Date(),
      },
    });

    return actualizada;
  }

  /**
   * Elimina una colección. Los menús que pertenecían a ella NO se borran:
   * la FK `menus_del_dia.coleccion_id` tiene onDelete: SetNull en el
   * schema, así que Postgres los deja automáticamente en "Sin colección".
   */
  async remove(userId: bigint, collectionId: number) {
    const restaurant = await this.findRestaurantByUserId(userId);

    const coleccion = await this.prisma.menu_colecciones.findFirst({
      where: { id: BigInt(collectionId), restaurante_id: restaurant.id },
    });

    if (!coleccion) {
      throw new NotFoundException('No se encontró la colección.');
    }

    await this.prisma.menu_colecciones.delete({
      where: { id: coleccion.id },
    });

    return { message: 'Colección eliminada correctamente.' };
  }
}
