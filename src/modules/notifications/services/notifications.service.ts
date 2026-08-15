import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

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
