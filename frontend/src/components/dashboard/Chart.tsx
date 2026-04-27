'use client';

import { useEffect, useRef } from 'react';
import { Candlestick } from '@/types/crypto';

interface ChartProps {
  data: Candlestick[];
  symbol: string;
}

export function Chart({ data, symbol }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = canvas.parentElement?.clientWidth || 800;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Find min/max for scaling
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const candleWidth = (width / data.length) * 0.7;
    const spacing = (width / data.length) * 0.3;

    data.forEach((candle, index) => {
      const x = index * (candleWidth + spacing) + spacing;
      const openY = height - ((candle.open - minPrice) / priceRange) * height;
      const closeY = height - ((candle.close - minPrice) / priceRange) * height;
      const highY = height - ((candle.high - minPrice) / priceRange) * height;
      const lowY = height - ((candle.low - minPrice) / priceRange) * height;

      const isBullish = candle.close > candle.open;
      ctx.fillStyle = isBullish ? '#10b981' : '#ef4444';
      ctx.strokeStyle = isBullish ? '#10b981' : '#ef4444';

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, Math.min(openY, closeY), candleWidth, bodyHeight);
    });

    // Draw price labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px monospace';
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (priceRange * i) / 4;
      const y = height - (priceRange * i) / 4;
      ctx.fillText(`$${price.toFixed(2)}`, 5, y);
    }

  }, [data]);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">{symbol}/USDT</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">1m</button>
          <button className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">5m</button>
          <button className="px-3 py-1 bg-blue-600 rounded-lg text-sm">15m</button>
          <button className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">1h</button>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: '400px' }} />
    </div>
  );
}