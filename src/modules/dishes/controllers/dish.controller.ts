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

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { CreateDishDto } from '../dto/create-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';

import { DishService } from '../services/dish.service';

@ApiTags('Restaurant - Dishes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dishes')
export class DishController {
  constructor(
    private readonly dishService: DishService,
  ) {}

  /**
   * Crear un plato.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un plato',
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
      nombre: {
        type: 'string',
      },
      descripcion: {
        type: 'string',
      },
      precio: {
        type: 'number',
      },
      categoriaId: {
        type: 'number',
      },
      estado: {
        type: 'string',
        enum: ['disponible', 'agotado'],
      },
      activo: {
        type: 'boolean',
      },
    },
    required: [
      'image',
      'nombre',
      'descripcion',
      'precio',
      'categoriaId',
    ],
  },
})
@UseInterceptors(FileInterceptor('image'))
  async create(
    @CurrentUser('id')
    userId: bigint,

    @Body()
    createDishDto: CreateDishDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.dishService.create(
      userId,
      createDishDto,
      file,
    );
  }

  /**
   * Obtener todos los platos
   * del restaurante autenticado.
   */
  @Get()
  @ApiOperation({
    summary:
      'Obtener todos los platos del restaurante autenticado',
  })
  async findAll(
    @CurrentUser('id')
    userId: bigint,
  ) {
    return this.dishService.findAll(
      userId,
    );
  }

  /**
   * Obtener un plato específico.
   */
  @Get(':id')
  @ApiOperation({
    summary:
      'Obtener detalle de un plato',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  async findOne(
    @CurrentUser('id')
    userId: bigint,

    @Param(
      'id',
      ParseIntPipe,
    )
    dishId: number,
  ) {
    return this.dishService.findOne(
      userId,
      dishId,
    );
  }

  /**
   * Actualizar un plato.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Editar un plato',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateDishDto,
  })
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async update(
    @CurrentUser('id')
    userId: bigint,

    @Param(
      'id',
      ParseIntPipe,
    )
    dishId: number,

    @Body()
    updateDishDto: UpdateDishDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.dishService.update(
      userId,
      dishId,
      updateDishDto,
      file,
    );
  }

  /**
   * Eliminar un plato.
   */
  @Delete(':id')
  @ApiOperation({
    summary:
      'Eliminar un plato',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  async remove(
    @CurrentUser('id')
    userId: bigint,

    @Param(
      'id',
      ParseIntPipe,
    )
    dishId: number,
  ) {
    return this.dishService.remove(
      userId,
      dishId,
    );
  }
}