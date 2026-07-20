import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { rol_usuario } from '@prisma/client';

import { RestaurantRequestsAdminService } from '../services/restaurant-requests-admin.service';
import { RejectRestaurantRequestDto } from '../dto/reject-restaurant-request.dto';

@ApiTags('Admin - Restaurant Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(rol_usuario.administrador)
@Controller('admin/restaurant-requests')
export class RestaurantRequestsAdminController {
  constructor(
    private readonly restaurantRequestsAdminService: RestaurantRequestsAdminService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener el listado de solicitudes de restaurantes',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado de la solicitud',
    example: 'pendiente',
  })
  @ApiQuery({
    name: 'restaurantName',
    required: false,
    description: 'Filtrar por nombre del restaurante',
    example: 'Pizzería Don Carlos',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filtrar por fecha (YYYY-MM-DD)',
    example: '2026-07-20',
  })
  async getAllRequests(
    @Query('status') status?: string,
    @Query('restaurantName') restaurantName?: string,
    @Query('date') date?: string,
  ) {
    return this.restaurantRequestsAdminService.getAllRequests({
      status,
      restaurantName,
      date,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener el detalle completo de una solicitud',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la solicitud',
  })
  async getRequestById(
    @Param('id') id: number,
  ) {
    return this.restaurantRequestsAdminService.getRequestById(id);
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Aprobar una solicitud de restaurante',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la solicitud',
  })
  async approveRequest(
    @Param('id') id: number,
    @Request() req,
  ) {
    return this.restaurantRequestsAdminService.approveRequest(
      id,
      req.user.id,
    );
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Rechazar una solicitud de restaurante',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la solicitud',
  })
  async rejectRequest(
    @Param('id') id: number,
    @Body() dto: RejectRestaurantRequestDto,
    @Request() req,
  ) {
    return this.restaurantRequestsAdminService.rejectRequest(
      id,
      req.user.id,
      dto,
    );
  }
}