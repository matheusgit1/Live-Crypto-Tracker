"use client";

import { CryptoPrice } from "@/types/crypto";
import {
  formatPrice,
  formatPercentage,
  getChangeColor,
  formatVolume,
} from "@/utils/formatters";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import { TbActivity } from "react-icons/tb";

interface PriceCardProps {
  data: CryptoPrice;
  onSelect?: (symbol: string) => void;
}

export function PriceCard({ data, onSelect }: PriceCardProps) {
  const { symbol, price, change24h, volume24h, high24h, low24h } = data;
  const changeColor = getChangeColor(change24h);
  const TrendIcon = change24h > 0 ? IoMdTrendingUp : IoMdTrendingDown;

  return (
    <div
      onClick={() => onSelect?.(symbol)}
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-blue-500 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <p className="text-sm text-gray-400">USDT</p>
        </div>
        <div
          className={`p-2 rounded-lg ${change24h > 0 ? "bg-green-500/10" : "bg-red-500/10"}`}
        >
          <TrendIcon className={`${changeColor} text-xl`} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-white">${formatPrice(price)}</p>
        <p className={`${changeColor} font-medium`}>
          {formatPercentage(change24h)}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Volume 24h</span>
          <span className="text-white font-medium">
            {formatVolume(volume24h)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">24h High</span>
          <span className="text-white">${formatPrice(high24h)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">24h Low</span>
          <span className="text-white">${formatPrice(low24h)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Live</span>
          <TbActivity className="animate-pulse text-green-500" />
        </div>
      </div>
    </div>
  );
}
