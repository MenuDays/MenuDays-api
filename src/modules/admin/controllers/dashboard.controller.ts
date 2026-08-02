import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { rol_usuario } from '@prisma/client';

import { DashboardService } from '../services/dashboard.service';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(rol_usuario.administrador)
@Controller('admin')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('dashboard')
  @ApiOperation({
    summary:
      'Obtener las estadísticas generales del Dashboard de administración',
  })
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }
}