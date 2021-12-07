import { Module } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
