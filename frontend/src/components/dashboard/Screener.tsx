'use client';

import { ScreenerItem } from '@/types/crypto';
import { formatPrice, formatPercentage, getChangeColor } from '@/utils/formatters';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const mockScreenerData: ScreenerItem[] = [
  { symbol: 'BTC', price: 52345.67, change24h: 2.34, volume24h: 28.5e9, trend: 'up' },
  { symbol: 'ETH', price: 3120.45, change24h: -1.23, volume24h: 15.2e9, trend: 'down' },
  { symbol: 'SOL', price: 98.76, change24h: 5.67, volume24h: 3.8e9, trend: 'up' },
  { symbol: 'ADA', price: 0.543, change24h: -0.87, volume24h: 0.9e9, trend: 'down' },
  { symbol: 'DOGE', price: 0.123, change24h: 8.91, volume24h: 1.2e9, trend: 'up' },
];

export function Screener() {
  const gainers = [...mockScreenerData].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const losers = [...mockScreenerData].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Market Screener</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div>
          <h4 className="text-sm font-medium text-green-500 mb-3 flex items-center gap-2">
            <FaArrowUp /> Top Gainers
          </h4>
          <div className="space-y-3">
            {gainers.map((item, idx) => (
              <div key={item.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">#{idx + 1}</span>
                  <span className="text-white font-medium">{item.symbol}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white">${formatPrice(item.price)}</span>
                  <span className={`${getChangeColor(item.change24h)} font-medium`}>
                    {formatPercentage(item.change24h)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h4 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2">
            <FaArrowDown /> Top Losers
          </h4>
          <div className="space-y-3">
            {losers.map((item, idx) => (
              <div key={item.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">#{idx + 1}</span>
                  <span className="text-white font-medium">{item.symbol}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white">${formatPrice(item.price)}</span>
                  <span className={`${getChangeColor(item.change24h)} font-medium`}>
                    {formatPercentage(item.change24h)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}