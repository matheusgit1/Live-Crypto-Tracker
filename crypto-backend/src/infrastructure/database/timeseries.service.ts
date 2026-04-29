import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { PriceEntity } from './entities/price.entity';
import { CandleEntity } from './entities/candle.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

@Injectable()
export class TimeSeriesService {
  private readonly logger = new Logger(TimeSeriesService.name);

  // Cache para candles em memória (otimização)
  private candleCache: Map<string, CandleEntity> = new Map();

  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    @InjectRepository(CandleEntity)
    private candleRepository: Repository<CandleEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('price.update')
  async savePrice(priceData: PriceData) {
    try {
      // Salva preço pontual
      const price = this.priceRepository.create({
        id: uuidv4(),
        symbol: priceData.symbol,
        price: priceData.price,
        change24h: priceData.change24h,
        volume24h: priceData.volume24h,
        high24h: priceData.high24h,
        low24h: priceData.low24h,
        open24h: priceData.price, // Simplificado
        timestamp: new Date(priceData.timestamp),
      });

      await this.priceRepository.save(price);

      // Atualiza candles para diferentes intervalos
      await this.updateCandles(priceData);

      this.logger.debug(
        `💾 Preço salvo: ${priceData.symbol} = ${priceData.price}`,
      );
    } catch (error: any) {
      this.logger.error(`Erro ao salvar preço: ${error.message}`);
    }
  }

  private async updateCandles(priceData: PriceData) {
    const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];

    for (const interval of intervals) {
      await this.updateCandle(priceData, interval);
    }
  }

  private async updateCandle(priceData: PriceData, interval: string) {
    const timestamp = new Date(priceData.timestamp);
    const candleTimestamp = this.getCandleTimestamp(timestamp, interval);
    const cacheKey = `${priceData.symbol}_${interval}_${candleTimestamp.getTime()}`;
    let candle: CandleEntity | undefined | null;
    candle = this.candleCache.get(cacheKey);

    if (!candle) {
      // Busca no banco
      candle = await this.candleRepository.findOne({
        where: {
          symbol: priceData.symbol,
          interval,
          timestamp: candleTimestamp,
        },
      });

      if (!candle) {
        // Cria novo candle
        candle = this.candleRepository.create({
          id: uuidv4(),
          symbol: priceData.symbol,
          interval,
          open: priceData.price,
          high: priceData.price,
          low: priceData.price,
          close: priceData.price,
          volume: 0,
          timestamp: candleTimestamp,
        });
      }

      this.candleCache.set(cacheKey, candle);
    }

    // Atualiza candle
    candle.high = Math.max(candle.high, priceData.price);
    candle.low = Math.min(candle.low, priceData.price);
    candle.close = priceData.price;
    candle.volume += priceData.volume24h / 1000000; // Ajuste de volume

    // Salva a cada 10 atualizações ou se for o último do período
    await this.candleRepository.save(candle);
  }

  private getCandleTimestamp(date: Date, interval: string): Date {
    const d = new Date(date);
    const minutes = d.getMinutes();
    const hours = d.getHours();

    switch (interval) {
      case '1m':
        d.setSeconds(0, 0);
        break;
      case '5m':
        d.setMinutes(Math.floor(minutes / 5) * 5, 0, 0);
        break;
      case '15m':
        d.setMinutes(Math.floor(minutes / 15) * 15, 0, 0);
        break;
      case '1h':
        d.setMinutes(0, 0, 0);
        break;
      case '4h':
        d.setHours(Math.floor(hours / 4) * 4, 0, 0, 0);
        break;
      case '1d':
        d.setHours(0, 0, 0, 0);
        break;
    }

    return d;
  }

  // Métodos para consulta (API endpoints)
  async getHistory(
    symbol: string,
    from?: Date,
    to?: Date,
    interval: string = '5m',
  ) {
    const query: any = {
      symbol,
      interval,
    };

    if (from) query.timestamp = MoreThan(from);
    if (to) query.timestamp = LessThan(to);

    const candles = await this.candleRepository.find({
      where: query,
      order: { timestamp: 'ASC' },
      take: 500, // Limite por segurança
    });

    return candles.map((c) => ({
      time: c.timestamp.getTime(),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
    }));
  }

  async getLatestPrices(symbols?: string[]) {
    const query = this.priceRepository
      .createQueryBuilder('price')
      .distinctOn(['price.symbol'])
      .orderBy('price.symbol', 'ASC')
      .addOrderBy('price.timestamp', 'DESC');

    if (symbols && symbols.length > 0) {
      query.where('price.symbol IN (:...symbols)', { symbols });
    }

    const prices = await query.getMany();

    return prices.map((p) => ({
      symbol: p.symbol,
      price: p.price,
      change24h: p.change24h,
      volume24h: p.volume24h,
      high24h: p.high24h,
      low24h: p.low24h,
      timestamp: p.timestamp.getTime(),
    }));
  }

  async getStats(symbol: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const prices = await this.priceRepository.find({
      where: {
        symbol,
        timestamp: MoreThan(since),
      },
      order: { timestamp: 'ASC' },
    });

    if (prices.length === 0) return null;

    const pricesValues = prices.map((p) => p.price);

    return {
      symbol,
      currentPrice: prices[prices.length - 1].price,
      highestPrice: Math.max(...pricesValues),
      lowestPrice: Math.min(...pricesValues),
      avgPrice: pricesValues.reduce((a, b) => a + b, 0) / pricesValues.length,
      volumeTotal: prices.reduce((sum, p) => sum + p.volume24h, 0),
      startPrice: prices[0].price,
      endPrice: prices[prices.length - 1].price,
      changePercent:
        ((prices[prices.length - 1].price - prices[0].price) /
          prices[0].price) *
        100,
      dataPoints: prices.length,
    };
  }
}
