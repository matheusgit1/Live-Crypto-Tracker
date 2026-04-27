import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { CryptoPrice, Alert } from '@/types/crypto';

interface UseWebSocketOptions {
  symbols: string[];
  onPriceUpdate?: (price: CryptoPrice) => void;
  onAlertTriggered?: (alert: Alert) => void;
}

export function useWebSocket({ symbols, onPriceUpdate, onAlertTriggered }: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Mock WebSocket para desenvolvimento
    // Quando backend estiver pronto, substituir pela URL real
    const mockInterval = setInterval(() => {
      const mockPrice: CryptoPrice = {
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        price: 50000 + Math.random() * 10000,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1_000_000_000,
        high24h: 55000,
        low24h: 45000,
        timestamp: Date.now(),
      };
      
      setPrices(prev => new Map(prev).set(mockPrice.symbol, mockPrice));
      onPriceUpdate?.(mockPrice);
    }, 2000);

    // TODO: Substituir pelo WebSocket real do backend
    /*
    const socket = io('http://localhost:4001/prices');
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe', { symbols });
    });

    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('price:update', (price: CryptoPrice) => {
      setPrices(prev => new Map(prev).set(price.symbol, price));
      onPriceUpdate?.(price);
    });

    socket.on('alert:triggered', (alert: Alert) => {
      onAlertTriggered?.(alert);
    });
    */

    return () => {
      clearInterval(mockInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [symbols]);

  const subscribe = useCallback((newSymbols: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe', { symbols: newSymbols });
    }
  }, []);

  const unsubscribe = useCallback((removedSymbols: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe', { symbols: removedSymbols });
    }
  }, []);

  const createAlert = useCallback((alert: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('create-alert', alert);
    }
  }, []);

  return { prices: Array.from(prices.values()), isConnected, subscribe, unsubscribe, createAlert };
}