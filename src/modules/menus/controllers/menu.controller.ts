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

import { MenuService } from '../services/menu.service';

import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@ApiTags('Menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
  ) {}

  /**
   * Crear menú del día.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear menú del día',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Opcional -- si no se manda, el menú queda sin foto.',
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
        fechaInicio: {
          type: 'string',
          format: 'date',
        },
        fechaFin: {
          type: 'string',
          format: 'date',
        },
        coleccionId: {
          type: 'number',
        },
        componenteEntrada: { type: 'array', items: { type: 'string' } },
        componenteSopa: { type: 'array', items: { type: 'string' } },
        componentePlatoFuerte: { type: 'array', items: { type: 'string' } },
        componenteJugo: { type: 'array', items: { type: 'string' } },
        componentePostre: { type: 'array', items: { type: 'string' } },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        tipoProgramacion: {
          type: 'string',
          enum: ['hoy', 'fecha', 'semanal'],
        },
        diasSemana: {
          type: 'array',
          items: { type: 'number' },
          description: '1=Lunes ... 7=Domingo, solo si tipoProgramacion=semanal.',
        },
      },
      required: [
        'nombre',
        'precio',
        'fechaInicio',
        'fechaFin',
      ],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createMenu(
    @CurrentUser('id') userId: bigint,

    @Body()
    createMenuDto: CreateMenuDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.menuService.create(
      userId,
      createMenuDto,
      file,
    );
  }

  /**
   * Obtener todos los menús del restaurante autenticado.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener mis menús',
  })
  async getMenus(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.menuService.findAll(userId);
  }

  /**
   * Obtener un menú por ID.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un menú',
  })
  async getMenuById(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    menuId: number,
  ) {
    return this.menuService.findOne(
      userId,
      menuId,
    );
  }

  /**
   * Actualizar menú.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar menú',
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
        fechaInicio: {
          type: 'string',
          format: 'date',
        },
        fechaFin: {
          type: 'string',
          format: 'date',
        },
        coleccionId: {
          type: 'number',
        },
        componenteEntrada: { type: 'array', items: { type: 'string' } },
        componenteSopa: { type: 'array', items: { type: 'string' } },
        componentePlatoFuerte: { type: 'array', items: { type: 'string' } },
        componenteJugo: { type: 'array', items: { type: 'string' } },
        componentePostre: { type: 'array', items: { type: 'string' } },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        tipoProgramacion: {
          type: 'string',
          enum: ['hoy', 'fecha', 'semanal'],
        },
        diasSemana: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateMenu(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    menuId: number,

    @Body()
    updateMenuDto: UpdateMenuDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.menuService.update(
      userId,
      menuId,
      updateMenuDto,
      file,
    );
  }

  /**
 * Publicar / ocultar un menú.
 */
@Patch(':id/toggle')
@ApiOperation({
  summary: 'Publicar u ocultar un menú del día',
})
async toggle(
  @CurrentUser('id') userId: bigint,

  @Param('id', ParseIntPipe)
  menuId: number,
) {
  return this.menuService.toggle(
    userId,
    menuId,
  );
}
  /**
   * Eliminar menú.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar menú',
  })
  async deleteMenu(
    @CurrentUser('id') userId: bigint,

    @Param('id', ParseIntPipe)
    menuId: number,
  ) {
    return this.menuService.remove(
      userId,
      menuId,
    );
  }
}