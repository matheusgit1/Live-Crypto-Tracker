'use client';

import { useState, useEffect } from 'react';
import { PriceCard } from '@/components/dashboard/PriceCard';
import { Chart } from '@/components/dashboard/Chart';
import { Screener } from '@/components/dashboard/Screener';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertList } from '@/components/alerts/AlertList';
import { useWebSocket } from '@/hooks/useWebSocket';
import { CryptoPrice, Candlestick, Alert, AlertFormData } from '@/types/crypto';
import { FaBell, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';


const mockPrices: CryptoPrice[] = [
  { symbol: 'BTC', price: 52345.67, change24h: 2.34, volume24h: 28.5e9, high24h: 53500, low24h: 51800, timestamp: Date.now() },
  { symbol: 'ETH', price: 3120.45, change24h: -1.23, volume24h: 15.2e9, high24h: 3200, low24h: 3080, timestamp: Date.now() },
  { symbol: 'SOL', price: 98.76, change24h: 5.67, volume24h: 3.8e9, high24h: 102, low24h: 94, timestamp: Date.now() },
  { symbol: 'ADA', price: 0.543, change24h: -0.87, volume24h: 0.9e9, high24h: 0.56, low24h: 0.53, timestamp: Date.now() },
  { symbol: 'DOGE', price: 0.123, change24h: 8.91, volume24h: 1.2e9, high24h: 0.13, low24h: 0.118, timestamp: Date.now() },
];

const mockCandlesticks: Candlestick[] = Array.from({ length: 50 }, (_, i) => ({
  time: Date.now() - (50 - i) * 60000,
  open: 50000 + Math.random() * 5000,
  high: 52000 + Math.random() * 3000,
  low: 49000 + Math.random() * 3000,
  close: 51000 + Math.random() * 4000,
  volume: Math.random() * 1000,
}));

const mockAlerts: Alert[] = [
  {
    id: '1',
    symbol: 'BTC',
    type: 'price',
    condition: 'above',
    targetValue: 55000,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    symbol: 'ETH',
    type: 'percentage',
    condition: 'below',
    targetValue: -5,
    isActive: true,
    createdAt: new Date(),
  },
];

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [prices, setPrices] = useState<CryptoPrice[]>(mockPrices);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [stats] = useState({
    totalVolume: '52.4B',
    activeAlerts: 8,
    marketCap: '1.84T',
  });

  const { isConnected } = useWebSocket({
    symbols: prices.map(p => p.symbol),
    onPriceUpdate: (price) => {
      setPrices(prev => prev.map(p => p.symbol === price.symbol ? price : p));
    },
    onAlertTriggered: (alert) => {
      toast.success(`🚨 ${alert.symbol} alert triggered!`, {
        duration: 5000,
        icon: '🔔',
      });
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, triggeredAt: new Date() } : a));
    },
  });

  const handleCreateAlert = (alertData: AlertFormData) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      ...alertData,
      isActive: true,
      createdAt: new Date(),
    };
    setAlerts(prev => [newAlert, ...prev]);
    toast.success('Alert created successfully!');
    setShowAlertForm(false);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast.success('Alert deleted');
  };

  const selectedPrice = prices.find(p => p.symbol === selectedSymbol);

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />
      
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-blue-500 text-2xl" />
              <h1 className="text-xl font-bold text-white">Live Crypto Tracker</h1>
              <div className="flex items-center gap-2 ml-4">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                  {isConnected ? 'Live' : 'Connecting...'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Total Volume</p>
                  <p className="text-sm text-white font-semibold">{stats.totalVolume}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaBell className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Active Alerts</p>
                  <p className="text-sm text-white font-semibold">{stats.activeAlerts}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {prices.map(price => (
            <PriceCard
              key={price.symbol}
              data={price}
              onSelect={setSelectedSymbol}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Chart data={mockCandlesticks} symbol={selectedSymbol} />
          </div>
          
          <div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
                <button
                  onClick={() => setShowAlertForm(!showAlertForm)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                >
                  + New Alert
                </button>
              </div>
              
              {showAlertForm && (
                <div className="mb-4">
                  <AlertForm onSubmit={handleCreateAlert} onClose={() => setShowAlertForm(false)} />
                </div>
              )}
              
              {selectedPrice && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={selectedPrice.change24h > 0 ? 'text-green-500' : 'text-red-500'}>
                      {selectedPrice.change24h > 0 ? '+' : ''}{selectedPrice.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="text-white">${(selectedPrice.volume24h / 1e9).toFixed(2)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h High/Low</span>
                    <span className="text-white">
                      ${selectedPrice.high24h.toFixed(2)} / ${selectedPrice.low24h.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Screener />
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Alerts</h3>
            <AlertList alerts={alerts} onDelete={handleDeleteAlert} />
          </div>
        </div>
      </main>
    </div>
  );
}