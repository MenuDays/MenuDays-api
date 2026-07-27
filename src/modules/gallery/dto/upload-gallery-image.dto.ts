import { ApiProperty } from '@nestjs/swagger';

export class UploadGalleryImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen de la galería del restaurante.',
  })
  image: any;
}