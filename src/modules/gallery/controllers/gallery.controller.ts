import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { GalleryService } from '../services/gallery.service';
import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Restaurant Gallery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
  ) {}

  /**
   * Obtener galería del restaurante autenticado.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener galería del restaurante',
  })
  async getGallery(
    @CurrentUser('id') userId: bigint,
  ) {
    return this.galleryService.getGallery(userId);
  }

  /**
   * Subir imagen.
   */
  @Post()
@ApiOperation({
  summary: 'Subir imagen a la galería',
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
    },
  },
})
@UseInterceptors(FileInterceptor('image'))
async uploadImage(
  @CurrentUser('id') userId: bigint,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.galleryService.uploadImage(
    userId,
    file,
  );
}

  /**
   * Eliminar imagen.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar imagen de la galería',
  })
  async deleteImage(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe)
    imageId: number,
  ) {
    return this.galleryService.deleteImage(
      userId,
      imageId,
    );
  }

  /**
   * Seleccionar imagen de portada.
   */
  @Patch(':id/cover')
  @ApiOperation({
    summary: 'Seleccionar imagen de portada',
  })
  async setCoverImage(
    @CurrentUser('id') userId: bigint,
    @Param('id', ParseIntPipe)
    imageId: number,
  ) {
    return this.galleryService.setCoverImage(
      userId,
      imageId,
    );
  }
}