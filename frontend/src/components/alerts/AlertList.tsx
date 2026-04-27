'use client';

import { Alert } from '@/types/crypto';
import { formatPrice, formatPercentage } from '@/utils/formatters';
import { FaTrash, FaBell, FaCheckCircle } from 'react-icons/fa';

interface AlertListProps {
  alerts: Alert[];
  onDelete: (id: string) => void;
}

export function AlertList({ alerts, onDelete }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-12 text-center">
        <FaBell className="text-gray-600 text-4xl mx-auto mb-3" />
        <p className="text-gray-400">No alerts created yet</p>
        <p className="text-gray-500 text-sm">Create your first alert to get notified</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-gray-800 rounded-lg p-4 border ${
            alert.isActive ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-white font-semibold">{alert.symbol}/USDT</h4>
                {alert.triggeredAt ? (
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaCheckCircle size={10} /> Triggered
                  </span>
                ) : alert.isActive ? (
                  <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              
              <p className="text-gray-300">
                Alert when price goes{' '}
                <span className="font-semibold text-white">{alert.condition}</span>{' '}
                {alert.type === 'price' ? (
                  <>${formatPrice(alert.targetValue)}</>
                ) : (
                  <>{formatPercentage(alert.targetValue)}</>
                )}
              </p>
              
              {alert.currentPrice && (
                <p className="text-sm text-gray-400 mt-2">
                  Current price: ${formatPrice(alert.currentPrice)}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(alert.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <button
              onClick={() => onDelete(alert.id)}
              className="text-gray-500 hover:text-red-500 transition p-2"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}