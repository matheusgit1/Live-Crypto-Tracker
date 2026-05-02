import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import WebSocket from 'ws';
import { BinanceTicker, BinanceTrade } from './binance.types';

@Injectable()
export class BinanceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BinanceService.name);
  private socket: WebSocket | null = null;
  private reconnectTimeout?: NodeJS.Timeout;
  private isConnected = false;
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws';

  private readonly SYMBOLS = [
    'btcusdt',
    'ethusdt',
    'solusdt',
    'adausdt',
    'dogeusdt',
    'xrpusdt',
    'ltcusdt',
    'bnbusdt',
  ];

  private readonly STREAMS = ['@trade', '@ticker', '@depth5'];

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
  }

  private connect() {
    const streams = this.SYMBOLS.flatMap((symbol) =>
      this.STREAMS.map((stream) => `${symbol}${stream}`),
    );
    const streamUrl = `${this.WS_URL}/${streams.join('/')}`;

    this.logger.log(`Conectando ao Binance WebSocket: ${streamUrl}`);
    this.socket = new WebSocket(streamUrl);

    this.socket.on('open', () => {
      this.logger.log('✅ Binance WebSocket conectado com sucesso');
      this.isConnected = true;
    });

    this.socket.on('message', (data) => {
      const payload = data.toString();
      this.handleMessage(payload);
    });

    this.socket.on('close', (code, reason) => {
      this.logger.warn(
        `❌ Binance WebSocket desconectado (code=${code}, reason=${reason?.toString() || 'nenhum'})`,
      );
      this.isConnected = false;
      this.scheduleReconnect();
    });

    this.socket.on('error', (error) => {
      this.logger.error('Erro no Binance WebSocket', error as Error);
      this.scheduleReconnect();
    });
  }

  private handleMessage(payload: string) {
    try {
      const data = JSON.parse(payload);

      if (data.result === null && data.id) {
        this.logger.log(
          `✅ ${data.method} sucesso: ${data.params?.join(', ')}`,
        );
        return;
      }

      this.processEvent(data);
    } catch (error) {
      this.logger.error('Falha ao processar mensagem', error as Error);
    }
  }

  private processEvent(event: any) {
    // Ticker 24h - ESSE É O MAIS IMPORTANTE PARA PREÇOS
    if (event.e === '24hrTicker') {
      const ticker = event as BinanceTicker;
      const symbol = ticker.s.replace('USDT', '');

      // Prepara dados para salvar
      const priceData = {
        symbol,
        price: parseFloat(ticker.c),
        change24h: parseFloat(ticker.P),
        volume24h: parseFloat(ticker.v),
        high24h: parseFloat(ticker.h),
        low24h: parseFloat(ticker.l),
        timestamp: ticker.E,
      };

      // Salva no TimescaleDB via evento
      this.eventEmitter.emit('price.update', priceData);

      // Também emite para WebSocket clients
      this.eventEmitter.emit('price.broadcast', priceData);

      this.logger.debug(
        `📊 ${symbol}: $${priceData.price} (${priceData.change24h}%)`,
      );
      return;
    }

    // Trade - útil para volume em tempo real
    if (event.e === 'trade') {
      const trade = event as BinanceTrade;
      this.eventEmitter.emit('trade.update', {
        symbol: trade.s.replace('USDT', ''),
        price: parseFloat(trade.p),
        quantity: parseFloat(trade.q),
        timestamp: trade.T,
      });
      return;
    }

    // Depth - útil para liquidez
    if (event.e === 'depthUpdate') {
      this.eventEmitter.emit('depth.update', {
        symbol: event.s.replace('USDT', ''),
        bids: event.b,
        asks: event.a,
        timestamp: event.E,
      });
      return;
    }
  }

  // Métodos públicos
  addSymbol(symbol: string) {
    const lowerSymbol = symbol.toLowerCase();
    if (!this.SYMBOLS.includes(lowerSymbol)) {
      const streamsToAdd = this.STREAMS.map(
        (stream) => `${lowerSymbol}${stream}`,
      );
      this.subscribeToStreams(streamsToAdd);
    }
  }

  private subscribeToStreams(streams: string[]) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const subscribeMsg = {
      method: 'SUBSCRIBE',
      params: streams,
      id: Date.now(),
    };

    this.socket.send(JSON.stringify(subscribeMsg));
    this.logger.log(`📡 Subscribed to streams: ${streams.join(', ')}`);
  }

  private unsubscribeFromStreams(streams: string[]) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const unsubscribeMsg = {
      method: 'UNSUBSCRIBE',
      params: streams,
      id: Date.now(),
    };

    this.socket.send(JSON.stringify(unsubscribeMsg));
  }

  removeSymbol(symbol: string) {
    const lowerSymbol = symbol.toLowerCase();
    const streamsToRemove = this.STREAMS.map(
      (stream) => `${lowerSymbol}${stream}`,
    );
    this.unsubscribeFromStreams(streamsToRemove);
  }

  private disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = undefined;
      this.logger.log('Tentando reconectar...');
      this.connect();
    }, 5000);
  }
}
