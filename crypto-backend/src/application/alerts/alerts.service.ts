import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import type { PriceData } from '@/infrastructure/binance/binance.types';
// import type { PriceData } from '@/infrastructure/binance/binance.types';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  // Mock alerts storage - replace with database
  private alerts: Map<string, any[]> = new Map();

  constructor(
    @InjectQueue('alerts') private alertQueue: Queue,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('price.full')
  async checkAlerts(priceData: PriceData) {
    // Get all active alerts for this symbol
    const symbolAlerts = this.alerts.get(priceData.symbol) || [];
    const activeAlerts = symbolAlerts.filter(
      (alert) => alert.isActive && !alert.triggeredAt,
    );

    for (const alert of activeAlerts) {
      let shouldTrigger = false;

      if (alert.type === 'price') {
        if (
          alert.condition === 'above' &&
          priceData.price >= alert.targetValue
        ) {
          shouldTrigger = true;
        } else if (
          alert.condition === 'below' &&
          priceData.price <= alert.targetValue
        ) {
          shouldTrigger = true;
        }
      } else if (alert.type === 'percentage') {
        if (
          alert.condition === 'above' &&
          priceData.change24h >= alert.targetValue
        ) {
          shouldTrigger = true;
        } else if (
          alert.condition === 'below' &&
          priceData.change24h <= alert.targetValue
        ) {
          shouldTrigger = true;
        }
      }

      if (shouldTrigger) {
        // Add to queue for processing
        await this.alertQueue.add('trigger-alert', {
          alert,
          currentPrice: priceData.price,
          timestamp: Date.now(),
        });
      }
    }
  }

  async createAlert(alertData: any): Promise<any> {
    const newAlert = {
      id: Date.now().toString(),
      ...alertData,
      createdAt: new Date(),
      isActive: true,
    };

    const userAlerts = this.alerts.get(alertData.userId) || [];
    userAlerts.push(newAlert);
    this.alerts.set(alertData.userId, userAlerts);

    return newAlert;
  }

  async getAlerts(userId: string): Promise<any[]> {
    return this.alerts.get(userId) || [];
  }

  async deleteAlert(userId: string, alertId: string): Promise<void> {
    const userAlerts = this.alerts.get(userId) || [];
    const filtered = userAlerts.filter((alert) => alert.id !== alertId);
    this.alerts.set(userId, filtered);
  }

  async toggleAlert(
    userId: string,
    alertId: string,
    isActive: boolean,
  ): Promise<any> {
    const userAlerts = this.alerts.get(userId) || [];
    const alert = userAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isActive = isActive;
    }
    return alert;
  }
}
