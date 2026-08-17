import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { MenuCollectionService } from '../services/menu-collection.service';

import { CreateMenuCollectionDto } from '../dto/create-menu-collection.dto';
import { UpdateMenuCollectionDto } from '../dto/update-menu-collection.dto';

@ApiTags('Menu Collections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('menu-collections')
export class MenuCollectionController {
  constructor(
    private readonly menuCollectionService: MenuCollectionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mis colecciones de menús' })
  async getMenuCollections(@CurrentUser('id') userId: bigint) {
    return this.menuCollectionService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear colección de menús' })
  async createMenuCollection(
    @CurrentUser('id') userId: bigint,
    @Body() createMenuCollectionDto: CreateMenuCollectionDto,
  ) {
    return this.menuCollectionService.create(userId, createMenuCollectionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Renombrar colección de menús' })
  async updateMenuCollection(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) collectionId: number,
    @Body() updateMenuCollectionDto: UpdateMenuCollectionDto,
  ) {
    return this.menuCollectionService.update(
      userId,
      collectionId,
      updateMenuCollectionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar colección de menús' })
  async deleteMenuCollection(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe) collectionId: number,
  ) {
    return this.menuCollectionService.remove(userId, collectionId);
  }
}
