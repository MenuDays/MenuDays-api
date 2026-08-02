import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { PromotionService } from '../services/promotion.service';

import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
  ) {}

  /**
   * Crear promoción.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear promoción',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        titulo: {
          type: 'string',
        },
        descripcion: {
          type: 'string',
        },
        precio: {
          type: 'number',
          format: 'float',
        },
        fechaInicio: {
          type: 'string',
          format: 'date',
        },
        fechaFin: {
          type: 'string',
          format: 'date',
        },
      },
      required: [
        'image',
        'titulo',
        'precio',
        'fechaInicio',
        'fechaFin',
      ],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @CurrentUser('id') userId: bigint,

    @Body()
    createPromotionDto: CreatePromotionDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.promotionService.create(
      userId,
      createPromotionDto,
      file,
    );
  }

  /**
   * Obtener todas las promociones
   * del restaurante autenticado.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener mis promociones',
  })
  async findAll(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.promotionService.findAll(
      userId,
    );
  }

  /**
   * Obtener una promoción por ID.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una promoción',
  })
  async findOne(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    promotionId: number,
  ) {
    return this.promotionService.findOne(
      userId,
      promotionId,
    );
  }

  /**
   * Actualizar promoción.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar promoción',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        titulo: {
          type: 'string',
        },
        descripcion: {
          type: 'string',
        },
        precio: {
          type: 'number',
          format: 'float',
        },
        fechaInicio: {
          type: 'string',
          format: 'date',
        },
        fechaFin: {
          type: 'string',
          format: 'date',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    promotionId: number,

    @Body()
    updatePromotionDto: UpdatePromotionDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.promotionService.update(
      userId,
      promotionId,
      updatePromotionDto,
      file,
    );
  }

  /**
   * Activar o desactivar
   * una promoción.
   */
  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Activar o desactivar una promoción',
  })
  async toggle(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    promotionId: number,
  ) {
    return this.promotionService.toggle(
      userId,
      promotionId,
    );
  }

  /**
   * Eliminar promoción.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar promoción',
  })
  async remove(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    promotionId: number,
  ) {
    return this.promotionService.remove(
      userId,
      promotionId,
    );
  }
}
