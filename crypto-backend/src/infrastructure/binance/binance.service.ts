
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import WebSocket from 'ws';
import { BinanceTrade, BinanceTicker, PriceData } from './binance.types';

@Injectable()
export class BinanceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BinanceService.name);
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 10;
  private readonly RECONNECT_DELAY = 5000;
  private isSubscribed = false;

  // Lista de símbolos que vamos monitorar
  private readonly SYMBOLS = ['btcusdt', 'ethusdt', 'solusdt', 'adausdt', 'dogeusdt'];
  
  // Cache de preços atuais
  private currentPrices: Map<string, PriceData> = new Map();

  constructor(private eventEmitter: EventEmitter2) {}

  async onModuleInit() {
    this.connect();
  }

  async onModuleDestroy() {
    this.disconnect();
  }

  private connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.logger.warn('WebSocket already connected');
      return;
    }

    this.logger.log('Connecting to Binance WebSocket...');
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

    this.ws.on('open', () => {
      this.logger.log('✅ Connected to Binance WebSocket');
      this.reconnectAttempts = 0;
      this.subscribe();
    });

    this.ws.on('message', (data: Buffer) => {
      this.handleMessage(data.toString());
    });

    this.ws.on('error', (error) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });

    this.ws.on('close', (code, reason) => {
      this.logger.warn(`WebSocket closed: ${code} - ${reason}`);
      this.reconnect();
    });
  }

  private subscribe() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.logger.error('Cannot subscribe: WebSocket not open');
      return;
    }

    // Subscribe to trade streams
    const tradeParams = this.SYMBOLS.map(s => `${s}@trade`);
    const tradeSubscribeMsg = {
      method: 'SUBSCRIBE',
      params: tradeParams,
      id: 1,
    };
    this.ws.send(JSON.stringify(tradeSubscribeMsg));
    this.logger.log(`Subscribed to trades: ${tradeParams.join(', ')}`);

    // Subscribe to 24hr ticker streams
    const tickerParams = this.SYMBOLS.map(s => `${s}@ticker`);
    const tickerSubscribeMsg = {
      method: 'SUBSCRIBE',
      params: tickerParams,
      id: 2,
    };
    this.ws.send(JSON.stringify(tickerSubscribeMsg));
    this.logger.log(`Subscribed to tickers: ${tickerParams.join(', ')}`);
  }

  private handleMessage(rawData: string) {
    try {
      const data = JSON.parse(rawData);

      // Handle subscription response
      if (data.result === null && data.id) {
        if (!this.isSubscribed) {
          this.logger.log(`✅ Subscribed to streams: ${data.params?.join(', ')}`);
          this.isSubscribed = true;
        }
        return;
      }

      // Handle trade events
      if (data.e === 'trade') {
        this.handleTrade(data as BinanceTrade);
      }
      
      // Handle 24hr ticker events
      if (data.e === '24hrTicker') {
        this.handleTicker(data as BinanceTicker);
      }
    } catch (error: any) {
      this.logger.error(`Error handling message: ${error.message}`);
    }
  }

  private handleTrade(trade: BinanceTrade) {
    const symbol = trade.s.replace('USDT', '');
    const price = parseFloat(trade.p);
    const timestamp = trade.T;

    // Update cached price
    const existing = this.currentPrices.get(symbol) || {
      symbol,
      price: 0,
      change24h: 0,
      volume24h: 0,
      high24h: 0,
      low24h: 0,
      timestamp: 0,
    };

    existing.price = price;
    existing.timestamp = timestamp;
    this.currentPrices.set(symbol, existing);

    // Emit event for real-time price updates
    this.eventEmitter.emit('price.update', {
      symbol,
      price,
      timestamp,
    });
  }

  private handleTicker(ticker: BinanceTicker) {
    const symbol = ticker.s.replace('USDT', '');
    const price = parseFloat(ticker.c);
    const change24h = parseFloat(ticker.P);
    const volume24h = parseFloat(ticker.v);
    const high24h = parseFloat(ticker.h);
    const low24h = parseFloat(ticker.l);
    const timestamp = ticker.E;

    // Update cached price with 24h stats
    const existing = this.currentPrices.get(symbol) || {
      symbol,
      price: 0,
      change24h: 0,
      volume24h: 0,
      high24h: 0,
      low24h: 0,
      timestamp: 0,
    };

    existing.price = price;
    existing.change24h = change24h;
    existing.volume24h = volume24h;
    existing.high24h = high24h;
    existing.low24h = low24h;
    existing.timestamp = timestamp;
    this.currentPrices.set(symbol, existing);

    // Emit event for complete price data
    this.eventEmitter.emit('price.full', this.currentPrices.get(symbol));
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.error('Max reconnection attempts reached. Giving up.');
      return;
    }

    this.reconnectAttempts++;
    this.logger.log(`Reconnecting in ${this.RECONNECT_DELAY}ms... (Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
    
    setTimeout(() => this.connect(), this.RECONNECT_DELAY);
  }

  private disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isSubscribed = false;
  }

  getCurrentPrices(): PriceData[] {
    return Array.from(this.currentPrices.values());
  }

  getPrice(symbol: string): PriceData | undefined {
    return this.currentPrices.get(symbol);
  }
}