import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AlertsService } from './alerts.service';
import { AlertsProcessor } from './alerts.processor';
import { EventsModule } from '@/infrastructure/events/events.module';

@Module({
  imports: [
    EventsModule,
    BullModule.registerQueue({
      name: 'alerts',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  providers: [AlertsService, AlertsProcessor],
  exports: [AlertsService],
})
export class AlertsModule {}
