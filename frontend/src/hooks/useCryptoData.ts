"use client";

import { useState, useEffect, useCallback } from "react";
import { CryptoPrice, Candlestick, ScreenerItem } from "@/types/crypto";

interface UseCryptoDataOptions {
  symbols?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useCryptoData({
  symbols = ["BTC", "ETH", "SOL", "ADA", "DOGE"],
  autoRefresh = true,
  refreshInterval = 5000,
}: UseCryptoDataOptions = {}) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [historicalData, setHistoricalData] = useState<
    Record<string, Candlestick[]>
  >({});
  const [screenerData, setScreenerData] = useState<ScreenerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock data generator
  const generateMockPrice = useCallback((symbol: string): CryptoPrice => {
    const basePrice: Record<string, number> = {
      BTC: 50000,
      ETH: 3000,
      SOL: 100,
      ADA: 0.5,
      DOGE: 0.12,
    };

    const change = (Math.random() - 0.5) * 10;
    const price = basePrice[symbol] * (1 + change / 100);

    return {
      symbol,
      price,
      change24h: change,
      volume24h: Math.random() * 1_000_000_000,
      high24h: price * (1 + Math.random() * 0.05),
      low24h: price * (1 - Math.random() * 0.05),
      timestamp: Date.now(),
    };
  }, []);

  // Generate screener data from prices
  const generateScreenerData = useCallback(
    (prices: CryptoPrice[]): ScreenerItem[] => {
      return prices.map((price) => ({
        symbol: price.symbol,
        price: price.price,
        change24h: price.change24h,
        volume24h: price.volume24h,
        trend: price.change24h > 0 ? "up" : "down",
      }));
    },
    [],
  );

  // Fetch current prices
  const fetchPrices = useCallback(async () => {
    try {
      // Mock API call - replace with real API
      const mockPrices = symbols.map(generateMockPrice);
      setPrices(mockPrices);
      setScreenerData(generateScreenerData(mockPrices));
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  }, [symbols, generateMockPrice, generateScreenerData]);

  // Fetch historical data for a symbol
  const fetchHistoricalData = useCallback(
    async (symbol: string, interval: string = "15m", limit: number = 100) => {
      try {
        // Mock historical data - replace with real API
        const mockCandlesticks: Candlestick[] = Array.from(
          { length: limit },
          (_, i) => {
            const basePrice = 50000;
            const volatility = 0.02;
            const randomWalk = (Math.random() - 0.5) * volatility;
            const open = basePrice * (1 + randomWalk);
            const close = open * (1 + (Math.random() - 0.5) * volatility);

            return {
              time: Date.now() - (limit - i) * 60000,
              open,
              high: Math.max(open, close) * (1 + Math.random() * 0.01),
              low: Math.min(open, close) * (1 - Math.random() * 0.01),
              close,
              volume: Math.random() * 1000,
            };
          },
        );

        setHistoricalData((prev) => ({
          ...prev,
          [symbol]: mockCandlesticks,
        }));

        return mockCandlesticks;
      } catch (err) {
        console.error(`Failed to fetch historical data for ${symbol}:`, err);
        return [];
      }
    },
    [],
  );

  // Get price for a specific symbol
  const getPrice = useCallback(
    (symbol: string): CryptoPrice | undefined => {
      return prices.find((p) => p.symbol === symbol);
    },
    [prices],
  );

  // Get top gainers
  const getTopGainers = useCallback(
    (limit: number = 5): ScreenerItem[] => {
      return [...screenerData]
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, limit);
    },
    [screenerData],
  );

  // Get top losers
  const getTopLosers = useCallback(
    (limit: number = 5): ScreenerItem[] => {
      return [...screenerData]
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, limit);
    },
    [screenerData],
  );

  // Get market stats
  const getMarketStats = useCallback(() => {
    const totalVolume = prices.reduce((sum, p) => sum + p.volume24h, 0);
    const avgChange =
      prices.reduce((sum, p) => sum + p.change24h, 0) / prices.length;
    const gainers = prices.filter((p) => p.change24h > 0).length;
    const losers = prices.filter((p) => p.change24h < 0).length;

    return {
      totalVolume,
      avgChange,
      gainers,
      losers,
      totalCoins: prices.length,
    };
  }, [prices]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      fetchPrices();
      const interval = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchPrices]);

  // Fetch initial data for all symbols
  useEffect(() => {
    fetchPrices();
    symbols.forEach((symbol) => {
      fetchHistoricalData(symbol);
    });
  }, [fetchPrices, fetchHistoricalData, symbols]);

  return {
    prices,
    historicalData,
    screenerData,
    loading,
    error,
    lastUpdated,
    fetchPrices,
    fetchHistoricalData,
    getPrice,
    getTopGainers,
    getTopLosers,
    getMarketStats,
    refresh: fetchPrices,
  };
}
