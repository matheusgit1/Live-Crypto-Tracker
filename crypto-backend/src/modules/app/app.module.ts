import { AuthModule } from './../../application/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoModule } from '../crypto/crypto.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { GlobalExceptionFilter } from '@/filters/global-execeptions.filters';
import { LoggingInterceptor } from '@/interceptor/logging.interceptor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@/application/auth/auth.guard';
import { ResponseInterceptor } from '@/interceptor/response.interceptor';
import { KeycloakModule } from '@/infrastructure/keycloack/keycloack.module';
import { BullModule } from '@nestjs/bull';
import { BinanceModule } from '@/infrastructure/binance/binance.module';
import { AlertsModule } from '@/application/alerts/alerts.module';

@Module({
  imports: [
    AuthModule,
    CryptoModule,
    AuthenticationModule,
    KeycloakModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BinanceModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
