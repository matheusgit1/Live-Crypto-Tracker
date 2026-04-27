export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: "price" | "percentage";
  condition: "above" | "below";
  targetValue: number;
  currentPrice?: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface AlertFormData {
  symbol: string;
  type: "price" | "percentage";
  condition: "above" | "below";
  targetValue: number;
}

export interface ScreenerItem {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  trend: "up" | "down";
}

export interface WebSocketMessage {
  type: "price" | "alert" | "trade";
  data: any;
  timestamp: number;
}
