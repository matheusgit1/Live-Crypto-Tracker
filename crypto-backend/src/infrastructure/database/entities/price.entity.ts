import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prices')
@Index(['symbol', 'timestamp'])
export class PriceEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  symbol: string;

  @Column('decimal', { precision: 20, scale: 8 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  change24h: number;

  @Column('decimal', { precision: 20, scale: 2 })
  volume24h: number;

  @Column('decimal', { precision: 20, scale: 8 })
  high24h: number;

  @Column('decimal', { precision: 20, scale: 8 })
  low24h: number;

  @Column('decimal', { precision: 20, scale: 8 })
  open24h: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn()
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }):
  createdAt: Date;

  @UpdateDateColumn()
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }):
  updatedAt: Date;
}
