import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
