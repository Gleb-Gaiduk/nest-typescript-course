import { Test, TestingModule } from '@nestjs/testing';
import { copyFile, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { ConfigService } from './../../config/config.service';
import { PhotosService } from './photos.service';

describe('PhotosService', () => {
  const fixtureFileName = 'test.png';
  const fixtureFilePath = `./test/fixtures/${fixtureFileName}`;
  let service: PhotosService;
  let config: ConfigService;

  beforeEach(async () => {
    // Make mocked config service
    const testConfigService = {
      STORAGE_PHOTOS: './storage/photos',
      STORAGE_THUMBS: './storage/tmp',
    } as ConfigService;

    const module: TestingModule = await Test.createTestingModule({
      // imports: [ConfigModule],
      providers: [
        PhotosService,
        {
          // Pass mocked config service
          provide: ConfigService,
          useValue: testConfigService,
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    config = module.get(ConfigService);
  });

  afterEach(async () => {
    await unlink(join(config.STORAGE_THUMBS, fixtureFileName)).catch(
      (error) => error,
    );
    await unlink(join(config.STORAGE_PHOTOS, fixtureFileName)).catch(
      (error) => error,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create photo thumbs', async () => {
    await copyFile(
      fixtureFilePath,
      join(config.STORAGE_PHOTOS, fixtureFileName),
    );

    const thumbs = await service.createThumbs(fixtureFileName);
    expect(thumbs.small).toContain(fixtureFileName);
    await expect(stat(thumbs.small)).resolves.toBeDefined();
  });

  it('should create a photo', async () => {
    await copyFile(
      fixtureFilePath,
      join(config.STORAGE_PHOTOS, fixtureFileName),
    );

    const file = {
      originalname: fixtureFileName,
      path: join(config.STORAGE_PHOTOS, fixtureFileName),
    } as Express.Multer.File;
    const photo = await service.create(file);
    await expect(
      stat(join(config.STORAGE_PHOTOS, photo.fileName)),
    ).resolves.toBeDefined();
    await unlink(join(config.STORAGE_PHOTOS, photo.fileName)).catch(
      (error) => error,
    );
    expect(photo.fileName).toContain('.png');
  });
});
