import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { rename } from 'fs/promises';
import { extname, join } from 'path';
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
}
