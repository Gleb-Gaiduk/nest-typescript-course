import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {
  constructor(public photosService: PhotosService) {}

  @Get()
  @Render('photos/index')
  index() {
    const photos = [
      {
        humbPath: '/thumbs/63612c1e5b6d310740742dea92e3ff01.png',
        downloadPath: '/photos/63612c1e5b6d310740742dea92e3ff01.png',
      },
      {
        humbPath: '/thumbs/63612c1e5b6d310740742dea92e3ff01.png',
        downloadPath: '/photos/63612c1e5b6d310740742dea92e3ff01.png',
      },
    ];

    return { photos };
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
