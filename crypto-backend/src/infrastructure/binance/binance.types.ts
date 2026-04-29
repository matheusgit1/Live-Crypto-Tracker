export interface BinanceTrade {
  e: string; // Event type: 'trade'
  E: number; // Event time
  s: string; // Symbol: 'BTCUSDT'
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time
  m: boolean; // Is buyer market maker
  M: boolean; // Ignore
}

export interface BinanceTicker {
  e: string; // Event type: '24hrTicker'
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  c: string; // Last price
  Q: string; // Last quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
}

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface SubscribeMessage {
  method: 'SUBSCRIBE';
  params: string[];
  id: number;
}

export interface UnsubscribeMessage {
  method: 'UNSUBSCRIBE';
  params: string[];
  id: number;
}
