// src/binance/binance.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BinanceService } from './binance.service';
import type { PriceData } from './binance.types';

@WebSocketGateway({
  namespace: 'prices',
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class PriceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PriceGateway.name);
  private clientSubscriptions: Map<string, Set<string>> = new Map();

  constructor(
    private eventEmitter: EventEmitter2,
    private binanceService: BinanceService,
  ) {
    this.server = new Server({
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
      },
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clientSubscriptions.set(client.id, new Set());

    // Send current prices immediately on connection
    const currentPrices = this.binanceService.getCurrentPrices();
    if (currentPrices.length > 0) {
      client.emit('price:update', currentPrices);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clientSubscriptions.delete(client.id);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbols: string[] },
  ) {
    const { symbols } = data;
    const clientSymbols = this.clientSubscriptions.get(client.id) || new Set();

    symbols.forEach((symbol) => {
      clientSymbols.add(symbol);
      client.join(`price:${symbol}`);
    });

    this.clientSubscriptions.set(client.id, clientSymbols);
    this.logger.log(`Client ${client.id} subscribed to: ${symbols.join(', ')}`);

    // Send current prices for subscribed symbols
    const currentPrices = symbols
      .map((symbol) => this.binanceService.getPrice(symbol))
      .filter((price) => price !== undefined);

    if (currentPrices.length > 0) {
      client.emit('price:update', currentPrices);
    }

    return { status: 'subscribed', symbols };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbols: string[] },
  ) {
    const { symbols } = data;
    const clientSymbols = this.clientSubscriptions.get(client.id);

    if (clientSymbols) {
      symbols.forEach((symbol) => {
        clientSymbols.delete(symbol);
        client.leave(`price:${symbol}`);
      });
    }

    this.logger.log(
      `Client ${client.id} unsubscribed from: ${symbols.join(', ')}`,
    );
    return { status: 'unsubscribed', symbols };
  }

  // Listen to price updates from BinanceService
  @OnEvent('price.full')
  handlePriceUpdate(priceData: PriceData) {
    // Broadcast to all clients subscribed to this symbol
    this.server.to(`price:${priceData.symbol}`).emit('price:update', priceData);
  }
}
