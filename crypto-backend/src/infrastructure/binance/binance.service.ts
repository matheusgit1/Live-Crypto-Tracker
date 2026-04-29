import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
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

  private readonly STREAMS = [
    '@trade',
    '@ticker',
    '@depth5',
  ];

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

  private subscribeToStreams(streams: string[]) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.logger.warn(
        'Não foi possível subscrever: WebSocket não está conectado',
      );
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
    this.logger.log(`📡 Unsubscribed from streams: ${streams.join(', ')}`);
  }

  addSymbol(symbol: string) {
    const lowerSymbol = symbol.toLowerCase();
    if (!this.SYMBOLS.includes(lowerSymbol)) {
      const streamsToAdd = this.STREAMS.map(
        (stream) => `${lowerSymbol}${stream}`,
      );
      this.subscribeToStreams(streamsToAdd);
    }
  }

  removeSymbol(symbol: string) {
    const lowerSymbol = symbol.toLowerCase();
    const streamsToRemove = this.STREAMS.map(
      (stream) => `${lowerSymbol}${stream}`,
    );
    this.unsubscribeFromStreams(streamsToRemove);
  }

  private disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.socket) {
      this.logger.log('Fechando conexão com Binance WebSocket');
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }

    this.isConnected = false;
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = undefined;
      this.logger.log('Tentando reconectar ao Binance WebSocket...');
      this.connect();
    }, 5000);
  }

  private handleMessage(payload: string) {
    try {
      const data = JSON.parse(payload);

      // Verificar se é uma resposta de SUBSCRIBE/UNSUBSCRIBE
      if (data.result === null && data.id) {
        this.logger.log(
          `✅ ${data.method} sucesso: ${data.params?.join(', ')}`,
        );
        return;
      }

      this.processEvent(data);
    } catch (error) {
      this.logger.error(
        'Falha ao processar mensagem do Binance WebSocket',
        error as Error,
      );
    }
  }

  private processEvent(event: any) {
    // Ticker 24h
    if (event.e === '24hrTicker') {
      const ticker = event as BinanceTicker;
      this.logger.log(
        `📊 Ticker ${ticker.s}: price=${ticker.c} | change=${ticker.P}% | volume=${ticker.v}`,
      );

      // TODO: Emitir evento para outros serviços
      // this.eventEmitter.emit('price.update', this.formatTicker(ticker));
      return;
    }

    // Trade
    if (event.e === 'trade') {
      const trade = event as BinanceTrade;
      this.logger.log(`💰 Trade ${trade.s}: price=${trade.p} | qty=${trade.q}`);

      // TODO: Emitir evento para outros serviços
      // this.eventEmitter.emit('trade.update', trade);
      return;
    }

    // Depth (ordens)
    if (event.e === 'depthUpdate') {
      this.logger.log(`📚 Depth update for ${event.s}`);
      // TODO: Processar book de ofertas
      return;
    }

    // Outros eventos
    this.logger.debug(`📨 Evento recebido: ${event.e || 'unknown'}`, event);
  }
}
