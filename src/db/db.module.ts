import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { ConfigModule } from '../config';
import { ConfigService } from './../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.DB_NAME,
        entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
        synchronizse: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
