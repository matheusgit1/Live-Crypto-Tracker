import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('alerts')
export class AlertsProcessor {
  private readonly logger = new Logger(AlertsProcessor.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @Process('trigger-alert')
  async handleTriggeredAlert(
    job: Job<{ alert: any; currentPrice: number; timestamp: number }>,
  ) {
    const { alert, currentPrice, timestamp } = job.data;

    this.logger.log(
      `Alert triggered: ${alert.symbol} ${alert.condition} ${alert.targetValue}`,
    );

    // Mark alert as triggered
    alert.triggeredAt = new Date();
    alert.isActive = false;

    // Emit event for WebSocket broadcast
    this.eventEmitter.emit('alert.triggered', {
      ...alert,
      currentPrice,
      timestamp,
    });

    // TODO: Send email notification
    // TODO: Send Telegram notification

    return { processed: true, alert };
  }
}
