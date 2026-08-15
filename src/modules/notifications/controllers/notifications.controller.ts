import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { NotificationsService } from '../services/notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Obtener las notificaciones del usuario autenticado.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar notificaciones del usuario autenticado',
  })
  findAll(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.notificationsService.findAll(userId);
  }

  /**
   * Cantidad de notificaciones no leídas (para el badge).
   */
  @Get('unread-count')
  @ApiOperation({
    summary: 'Cantidad de notificaciones no leídas',
  })
  getUnreadCount(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.notificationsService.getUnreadCount(userId);
  }

  /**
   * Marcar una notificación puntual como leída.
   */
  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marcar una notificación como leída',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la notificación',
    example: 1,
  })
  markAsRead(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markAsRead(
      userId,
      BigInt(id),
    );
  }

  /**
   * Marcar todas las notificaciones del usuario como leídas.
   */
  @Patch('read-all')
  @ApiOperation({
    summary: 'Marcar todas las notificaciones como leídas',
  })
  markAllAsRead(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
