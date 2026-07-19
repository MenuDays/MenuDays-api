import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../services/users.service';

import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
  })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Actualizar información del perfil',
  })
  updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
  }

  @Patch('profile/photo')
  @ApiOperation({
    summary: 'Actualizar fotografía de perfil',
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
  updatePhoto(
    @Request() req: any,
    @UploadedFile() file: any,
  ) {
    return this.usersService.updatePhoto(
      req.user.id,
      file,
    );
  }

  @Patch('profile/password')
  @ApiOperation({
    summary: 'Cambiar contraseña',
  })
  changePassword(
    @Request() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.id,
      updatePasswordDto,
    );
  }
 @Delete('profile/photo')
 @ApiOperation({
  summary: 'Eliminar fotografía de perfil',
})
deletePhoto(@Request() req: any) {
  return this.usersService.deletePhoto(req.user.id);
}
}