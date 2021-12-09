import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { stat } from 'fs/promises';
import { join } from 'path';
import { Auth } from '../../users/decorators/auth.decorator';
import { User } from '../../users/entities/user.entity';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { FileUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';
import { ConfigService } from './../../config/config.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {
  constructor(
    public photosService: PhotosService,
    private config: ConfigService,
  ) {}

  @Get()
  @Render('photos/index')
  async index() {
    const photos = await this.photosService.getUserPhotos();
    return { photos };
  }

  @Get('download/:filename')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async download(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Auth() user: User,
  ) {
    const file = join(this.config.STORAGE_PHOTOS, filename);

    if (!(await stat(file).catch(err => return null))) {
      throw new NotFoundException(`File "${filename} doesn't exist`);
    }

    res.download(file, filename, (err) => {
      if (err) {
        // handle error, file is not downloaded / interrupted
      } else {
        // success
      }
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const photo = await this.photosService.create(file);
    const thumbs = await this.photosService.createThumbs(photo.fileName);
    return { photo, file, body };
  }
}
