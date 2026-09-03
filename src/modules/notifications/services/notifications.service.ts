import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { notificacion_tipo } from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';

interface CreateNotificationInput {
  usuarioId: bigint;
  tipo: notificacion_tipo;
  titulo: string;
  mensaje: string;
  referenciaTipo?: string | null;
  referenciaId?: bigint | null;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Crea una notificación para un usuario, evitando duplicados: si ya
   * existe una del mismo (usuario, tipo, referencia), no crea otra y
   * devuelve la existente. Sirve para que un mismo evento (ej. "pedido
   * nuevo #123") no genere dos notificaciones si el disparador se
   * ejecuta más de una vez (reintentos, doble submit, etc.).
   */
  async createIfNotExists(input: CreateNotificationInput) {
    const referenciaTipo = input.referenciaTipo ?? null;
    const referenciaId = input.referenciaId ?? null;

    if (referenciaTipo !== null && referenciaId !== null) {
      const existing = await this.prisma.notificaciones.findFirst({
        where: {
          usuario_id: input.usuarioId,
          tipo: input.tipo,
          referencia_tipo: referenciaTipo,
          referencia_id: referenciaId,
        },
      });

      if (existing) {
        return existing;
      }
    }

    return this.prisma.notificaciones.create({
      data: {
        usuario_id: input.usuarioId,
        tipo: input.tipo,
        titulo: input.titulo,
        mensaje: input.mensaje,
        referencia_tipo: referenciaTipo,
        referencia_id: referenciaId,
      },
    });
  }

  /**
 * Listar las notificaciones del usuario autenticado,
 * más recientes primero.
 */
async findAll(
  userId: bigint,
) {

  return this.prisma.notificaciones.findMany({
    where: {
      usuario_id: userId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

}

  /**
 * Cantidad de notificaciones no leídas
 * del usuario autenticado -- para el badge.
 */
async getUnreadCount(
  userId: bigint,
) {

  const count = await this.prisma.notificaciones.count({
    where: {
      usuario_id: userId,
      leida: false,
    },
  });

  return { count };

}

  /**
 * Marcar una notificación como leída.
 *
 * Se valida que la notificación exista y que
 * pertenezca al usuario autenticado -- un usuario
 * no puede marcar como leída una notificación ajena.
 */
async markAsRead(
  userId: bigint,
  notificationId: bigint,
) {

  const notification = await this.prisma.notificaciones.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw new NotFoundException(
      'La notificación no existe.',
    );
  }

  if (notification.usuario_id !== userId) {
    throw new ForbiddenException(
      'No podés acceder a esta notificación.',
    );
  }

  return this.prisma.notificaciones.update({
    where: {
      id: notificationId,
    },
    data: {
      leida: true,
    },
  });

}

  /**
 * Marcar todas las notificaciones no leídas
 * del usuario autenticado como leídas.
 */
async markAllAsRead(
  userId: bigint,
) {

  const result = await this.prisma.notificaciones.updateMany({
    where: {
      usuario_id: userId,
      leida: false,
    },
    data: {
      leida: true,
    },
  });

  return {
    message: 'Notificaciones marcadas como leídas.',
    count: result.count,
  };

}
}
