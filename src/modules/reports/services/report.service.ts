import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';

import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportStatusDto } from '../dto/update-report-status.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crear un reporte.
   *
   * Se valida que el restaurante exista.
   *
   * Se valida que el motivo exista.
   *
   * Se verifica que el usuario no haya reportado
   * previamente el mismo restaurante.
   *
   * Se crea el reporte.
   */
  async create(userId: bigint, createReportDto: CreateReportDto) {
    const { restauranteId, motivoId, descripcion } = createReportDto;

    // Validar restaurante.

    await this.findRestaurantById(BigInt(restauranteId));

    // Validar motivo.

    await this.findReasonById(BigInt(motivoId));

    // Validar reporte duplicado.

    await this.validateDuplicateReport(userId, BigInt(restauranteId));

    // Crear reporte.

    return this.prisma.reportes.create({
      data: {
        usuario_id: userId,
        restaurante_id: BigInt(restauranteId),
        motivo_id: BigInt(motivoId),
        descripcion,
      },
      include: {
        motivos_reporte: true,
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
          },
        },
        usuarios_reportes_usuario_idTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
  }

  /**
   * Obtener los motivos de reporte disponibles.
   */
  async getMotivos() {
    return this.prisma.motivos_reporte.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  /**
   * Obtener todos los reportes.
   *
   * Devuelve el listado completo con la
   * información relacionada del usuario,
   * restaurante y motivo del reporte.
   */
  async findAll() {
    return this.prisma.reportes.findMany({
      include: {
        motivos_reporte: true,
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            estado_cuenta: true,
          },
        },
        usuarios_reportes_usuario_idTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        usuarios_reportes_revisado_porTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
  /**
   * Obtener un reporte por ID.
   *
   * Se valida que el reporte exista.
   *
   * Devuelve toda la información
   * relacionada al reporte.
   */
  async findOne(reportId: bigint) {
    // Validar reporte.

    await this.findReportById(reportId);

    // Obtener reporte.

    return this.prisma.reportes.findUnique({
      where: {
        id: reportId,
      },
      include: {
        motivos_reporte: true,
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            descripcion: true,
            direccion: true,
            estado_cuenta: true,
            logo_url: true,
            portada_url: true,
          },
        },
        usuarios_reportes_usuario_idTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            foto_perfil_url: true,
          },
        },
        usuarios_reportes_revisado_porTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
  }

  /**
   * Gestionar un reporte.
   *
   * Se valida que el reporte exista.
   *
   * Se actualiza el estado del reporte.
   *
   * Se registra el administrador que
   * realizó la revisión.
   */
  async update(
    adminId: bigint,
    reportId: bigint,
    updateReportStatusDto: UpdateReportStatusDto,
  ) {
    // Validar reporte.

    await this.findReportById(reportId);

    // Actualizar reporte.

    return this.prisma.reportes.update({
      where: {
        id: reportId,
      },
      data: {
        estado: updateReportStatusDto.estado,
        revisado_por: adminId,
        revisado_at: new Date(),
      },
      include: {
        motivos_reporte: true,
        restaurantes: {
          select: {
            id: true,
            nombre_comercial: true,
            estado_cuenta: true,
          },
        },
        usuarios_reportes_usuario_idTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        usuarios_reportes_revisado_porTousuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
  }

  /**
   * Buscar un reporte por ID.
   */
  private async findReportById(reportId: bigint) {
    const report = await this.prisma.reportes.findUnique({
      where: {
        id: reportId,
      },
    });

    if (!report) {
      throw new NotFoundException('El reporte no existe.');
    }

    return report;
  }

  /**
   * Buscar un restaurante.
   */
  private async findRestaurantById(restaurantId: bigint) {
    const restaurant = await this.prisma.restaurantes.findUnique({
      where: {
        id: restaurantId,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('El restaurante no existe.');
    }

    return restaurant;
  }

  /**
   * Buscar un motivo de reporte.
   */
  private async findReasonById(reasonId: bigint) {
    const reason = await this.prisma.motivos_reporte.findUnique({
      where: {
        id: reasonId,
      },
    });

    if (!reason) {
      throw new NotFoundException('El motivo del reporte no existe.');
    }

    return reason;
  }

  /**
   * Validar que el usuario no haya reportado
   * anteriormente el mismo restaurante.
   */
  private async validateDuplicateReport(userId: bigint, restaurantId: bigint) {
    const existingReport = await this.prisma.reportes.findFirst({
      where: {
        usuario_id: userId,
        restaurante_id: restaurantId,
      },
    });

    if (existingReport) {
      throw new BadRequestException('Ya has reportado este restaurante.');
    }
  }
}
