export interface Alert {
  id: string;
  userId: string;
  symbol: string;
  type: 'price' | 'percentage';
  condition: 'above' | 'below';
  targetValue: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface CheckAlertJob {
  symbol: string;
  price: number;
  change24h?: number;
}
