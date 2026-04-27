'use client';

import { useState } from 'react';
import { AlertFormData } from '@/types/crypto';
import { FaBell, FaTimes } from 'react-icons/fa';

interface AlertFormProps {
  onSubmit: (alert: AlertFormData) => void;
  onClose?: () => void;
}

const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOGE', 'XRP', 'DOT', 'LINK'];

export function AlertForm({ onSubmit, onClose }: AlertFormProps) {
  const [formData, setFormData] = useState<AlertFormData>({
    symbol: 'BTC',
    type: 'price',
    condition: 'above',
    targetValue: 50000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaBell className="text-yellow-500" />
          Create Alert
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cryptocurrency
          </label>
          <select
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}/USDT</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alert Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'price' })}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                formData.type === 'price'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Price Target
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'percentage' })}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                formData.type === 'percentage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              % Change
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Condition
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, condition: 'above' })}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                formData.condition === 'above'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Above
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, condition: 'below' })}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                formData.condition === 'below'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Below
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Value ({formData.type === 'price' ? 'USD' : '%'})
          </label>
          <input
            type="number"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) })}
            step={formData.type === 'price' ? 100 : 0.1}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
}