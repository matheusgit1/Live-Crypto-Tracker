// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PriceEntity } from './entities/price.entity';
import { CandleEntity } from './entities/candle.entity';
import { EventsModule } from '../events/events.module';
import { TimeSeriesService } from './timeseries.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'crypto_tracker'),
        entities: [PriceEntity, CandleEntity],
        synchronize: true, // Apenas desenvolvimento
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([PriceEntity, CandleEntity]),
    EventsModule,
  ],
  providers: [TimeSeriesService],
  exports: [TimeSeriesService],
})
export class DatabaseModule {}
