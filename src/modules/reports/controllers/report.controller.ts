import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportStatusDto } from '../dto/update-report-status.dto';

import { ReportsService } from '../services/report.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  /**
   * Crear un reporte.
   */
  @Post('reports')
  @ApiOperation({
    summary: 'Reportar restaurante',
  })
  @ApiBody({
    type: CreateReportDto,
  })
  create(
    @CurrentUser('id') userId: bigint,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.create(
      userId,
      createReportDto,
    );
  }

  /**
   * Obtener todos los reportes.
   */
  @Get('admin/reports')
  @ApiOperation({
    summary: 'Obtener reportes',
  })
  findAll() {
    return this.reportsService.findAll();
  }

  /**
   * Obtener un reporte por ID.
   */
  @Get('admin/reports/:id')
  @ApiOperation({
    summary: 'Obtener detalle del reporte',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte',
    example: 1,
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.reportsService.findOne(
      BigInt(id),
    );
  }

  /**
   * Gestionar un reporte.
   */
  @Patch('admin/reports/:id')
  @ApiOperation({
    summary: 'Gestionar reporte',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte',
    example: 1,
  })
  @ApiBody({
    type: UpdateReportStatusDto,
  })
  update(
    @CurrentUser('id') adminId: bigint,
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateReportStatusDto: UpdateReportStatusDto,
  ) {
    return this.reportsService.update(
      adminId,
      BigInt(id),
      updateReportStatusDto,
    );
  }
}