import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { rename } from 'fs/promises';
import { extname, join } from 'path';
import * as sharp from 'sharp';
import { ConfigService } from '../../config';

@Injectable()
export class PhotosService {
  constructor(private config: ConfigService) {}

  async create(file: Express.Multer.File) {
    const ext = extname(file.originalname).toLowerCase();
    const fileName = createHash('md5').update(file.path).digest('hex') + ext;
    const destFile = join(this.config.STORAGE_PHOTOS, fileName);
    await rename(file.path, destFile);

    return { fileName };
  }

  async createThumbs(fileName: string) {
    const srcFile = join(this.config.STORAGE_PHOTOS, fileName);
    const destFile = join(this.config.STORAGE_THUMBS, fileName);

    await sharp(srcFile)
      .rotate()
      .resize(200, 200, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 100 })
      .toFile(destFile);

    return { small: destFile };
  }
}
