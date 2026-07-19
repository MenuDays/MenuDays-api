import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';

import {
  CloudinaryService,
  CloudinaryFolder,
} from './cloudinary.service';

@ApiTags('Cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('test-upload')
  @ApiOperation({
    summary: 'Prueba de subida de imágenes a Cloudinary',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async testUpload(
    @UploadedFile() file: any,
  ) {
    return this.cloudinaryService.uploadImage(
      file,
      CloudinaryFolder.RESTAURANTS,
    );
  }

  @Delete('test-delete/:publicId')
  @ApiOperation({
    summary: 'Prueba de eliminación de imágenes de Cloudinary',
  })
  async testDelete(
    @Param('publicId') publicId: string,
  ) {
    await this.cloudinaryService.deleteImage(publicId);

    return {
      message: 'Imagen eliminada correctamente.',
    };
  }
}