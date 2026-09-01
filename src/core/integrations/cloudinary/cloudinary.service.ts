import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { Express } from 'express';
import {Multer} from 'multer';

export enum CloudinaryFolder {
  RESTAURANTS = 'restaurants',
  DISHES = 'dishes',
  MENUS = 'menus',
  PROMOTIONS = 'promotions',
  USERS = 'users',
  REQUESTS = 'restaurant-requests',
  CATEGORIES = 'categories',
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  // Tope de espera para que Cloudinary procese la subida. Sin esto, si
  // Cloudinary se cuelga la petición del cliente queda esperando hasta
  // SU propio timeout (con el menú a medio guardar). Con esto, el back
  // corta y devuelve un 5xx claro y rápido.
  private readonly UPLOAD_TIMEOUT_MS = 60_000;

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  private readonly ALLOWED_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  /**
   * Valida que el archivo exista
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException(
        'Debe seleccionar una imagen.',
      );
    }

    if (!this.ALLOWED_FORMATS.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de imagen no permitido.',
      );
    }

    this.validateImageSize(file);
  }

  /**
   * Valida el tamaño máximo permitido
   */
  private validateImageSize(file: Express.Multer.File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        'La imagen supera el tamaño máximo permitido (5 MB).',
      );
    }
  }

  /**
   * Obtiene el public_id a partir de una URL de Cloudinary
   */
  extractPublicId(url: string): string {
    const parts = url.split('/');

    const uploadIndex = parts.findIndex(
      (part) => part === 'upload',
    );

    if (uploadIndex === -1) {
      throw new BadRequestException(
        'URL de Cloudinary inválida.',
      );
    }

    const publicId = parts
      .slice(uploadIndex + 2)
      .join('/')
      .replace(/\.[^/.]+$/, '');

    return publicId;
  }
  /**
   * Sube una imagen a Cloudinary
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: CloudinaryFolder,
  ): Promise<{
    secure_url: string;
    public_id: string;
  }> {
    this.validateFile(file);

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `MenuDays/${folder}`,

          resource_type: 'image',

          unique_filename: true,

          overwrite: false,

          use_filename: false,

          timeout: this.UPLOAD_TIMEOUT_MS,

          transformation: [
            {
              fetch_format: 'auto',
              quality: 'auto',
              dpr: 'auto',
              width: 'auto',
              crop: 'limit',
              flags: 'progressive',
            },
          ],
        },
        (error, result) => {
          if (error) {
            this.logger.error(
              `Cloudinary rechazó la subida (folder ${folder}).`,
              error instanceof Error ? error.stack : JSON.stringify(error),
            );
            return reject(
              new InternalServerErrorException(
                'Error al subir la imagen a Cloudinary.',
              ),
            );
          }

          if (!result) {
            return reject(
              new InternalServerErrorException(
                'Cloudinary no devolvió información de la imagen.',
              ),
            );
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Genera una URL optimizada para mostrar imágenes.
   */
  getOptimizedUrl(url: string): string {
    if (!url) {
      return url;
    }

    return url.replace(
      '/upload/',
      '/upload/f_auto,q_auto,dpr_auto,w_auto,c_limit,fl_progressive/',
    );
  }
  /**
   * Elimina una imagen de Cloudinary utilizando su public_id
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) {
      throw new BadRequestException(
        'El public_id de la imagen es obligatorio.',
      );
    }

    try {
      const result = await this.cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok') {
        throw new InternalServerErrorException(
          'No fue posible eliminar la imagen de Cloudinary.',
        );
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error al eliminar la imagen de Cloudinary.',
      );
    }
  }
}