import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('candles')
@Index(['symbol', 'interval', 'timestamp'])
export class CandleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  symbol: string;

  @Column()
  interval: string; // '1m', '5m', '15m', '1h', '4h', '1d'

  @Column('decimal', { precision: 20, scale: 8 })
  open: number;

  @Column('decimal', { precision: 20, scale: 8 })
  high: number;

  @Column('decimal', { precision: 20, scale: 8 })
  low: number;

  @Column('decimal', { precision: 20, scale: 8 })
  close: number;

  @Column('decimal', { precision: 20, scale: 8 })
  volume: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
