// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from '../events/events.module';
import { TimeSeriesService } from './timeseries.service';
import { PriceEntity } from './entities/price.entity';
import { CandleEntity } from './entities/candle.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'crypto_metrics'),
        entities: [PriceEntity, CandleEntity],
        synchronize: false,
        autoLoadEntities: true,
        logging: configService.get('NODE_ENV') === 'development',
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([PriceEntity, CandleEntity]),
  ],
  providers: [TimeSeriesService],
  exports: [TimeSeriesService],
})
export class DatabaseModule {}
