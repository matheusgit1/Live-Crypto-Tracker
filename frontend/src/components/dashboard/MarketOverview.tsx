"use client";

import { useState, useEffect } from "react";
import {
  FaGlobe,
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface MarketMetric {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}

interface DominanceData {
  symbol: string;
  name: string;
  percentage: number;
  color: string;
}

export function MarketOverview() {
  const [metrics, setMetrics] = useState<MarketMetric[]>([
    {
      label: "Total Market Cap",
      value: "$1.84T",
      change: 2.34,
      icon: <FaGlobe className="text-blue-500" />,
    },
    {
      label: "24h Volume",
      value: "$52.4B",
      change: -1.23,
      icon: <FaChartLine className="text-green-500" />,
    },
    {
      label: "BTC Dominance",
      value: "48.2%",
      change: 0.56,
      icon: <FaBitcoin className="text-orange-500" />,
    },
    {
      label: "ETH Dominance",
      value: "18.7%",
      change: -0.34,
      icon: <FaEthereum className="text-purple-500" />,
    },
  ]);

  const [dominanceData, setDominanceData] = useState<DominanceData[]>([
    {
      symbol: "BTC",
      name: "Bitcoin",
      percentage: 48.2,
      color: "bg-orange-500",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      percentage: 18.7,
      color: "bg-purple-500",
    },
    { symbol: "BNB", name: "BNB", percentage: 4.5, color: "bg-yellow-500" },
    { symbol: "SOL", name: "Solana", percentage: 3.8, color: "bg-green-500" },
    { symbol: "XRP", name: "Ripple", percentage: 2.9, color: "bg-blue-500" },
    {
      symbol: "Others",
      name: "Others",
      percentage: 21.9,
      color: "bg-gray-500",
    },
  ]);

  const [fearGreedIndex, setFearGreedIndex] = useState({
    value: 62,
    level: "Greed",
    color: "bg-yellow-500",
  });

  useEffect(() => {
    // Mock updates
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          change: metric.change
            ? metric.change + (Math.random() - 0.5) * 0.5
            : undefined,
        })),
      );

      setFearGreedIndex({
        value: 50 + Math.random() * 40,
        level: Math.random() > 0.5 ? "Greed" : "Fear",
        color: Math.random() > 0.5 ? "bg-yellow-500" : "bg-red-500",
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Market Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{metric.icon}</div>
              {metric.change && (
                <div
                  className={`flex items-center gap-1 text-sm ${metric.change > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.change > 0 ? (
                    <FaArrowUp size={10} />
                  ) : (
                    <FaArrowDown size={10} />
                  )}
                  <span>{Math.abs(metric.change).toFixed(2)}%</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">{metric.label}</p>
            <p className="text-white text-xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Market Dominance & Fear & Greed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Dominance */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Market Dominance</h3>
          <div className="space-y-3">
            {dominanceData.map((item) => (
              <div key={item.symbol}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-white font-medium">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fear & Greed Index */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Fear & Greed Index</h3>
          <div className="flex flex-col items-center justify-center h-[80%]">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray={`${(fearGreedIndex.value / 100) * 439.8} 439.8`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {Math.round(fearGreedIndex.value)}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    fearGreedIndex.level === "Greed"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {fearGreedIndex.level}
                </span>
              </div>
            </div>
            <div className="flex justify-between w-full max-w-xs text-xs text-gray-400">
              <span>Extreme Fear</span>
              <span>Fear</span>
              <span>Neutral</span>
              <span>Greed</span>
              <span>Extreme Greed</span>
            </div>
            <div className="w-full max-w-xs h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
