"use client";

import { Alert } from "@/types/crypto";
import { formatPrice, formatPercentage } from "@/utils/formatters";
import {
  FaTrash,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useState } from "react";

interface AlertItemProps {
  alert: Alert;
  onDelete: (id: string) => void;
  onToggle?: (id: string, isActive: boolean) => void;
}

export function AlertItem({ alert, onDelete, onToggle }: AlertItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = () => {
    if (alert.triggeredAt) {
      return <FaCheckCircle className="text-green-500" />;
    }
    if (!alert.isActive) {
      return <FaClock className="text-gray-500" />;
    }
    return <FaBell className="text-blue-500 animate-pulse" />;
  };

  const getStatusText = () => {
    if (alert.triggeredAt) return "Triggered";
    if (!alert.isActive) return "Inactive";
    return "Active";
  };

  const getConditionText = () => {
    if (alert.type === "price") {
      return `${alert.condition === "above" ? "↑ Above" : "↓ Below"} $${formatPrice(alert.targetValue)}`;
    }
    return `${alert.condition === "above" ? "↑ Rises" : "↓ Drops"} ${formatPercentage(alert.targetValue)}`;
  };

  const getProgress = () => {
    if (!alert.currentPrice) return 0;
    if (alert.type === "price") {
      const progress = (alert.currentPrice / alert.targetValue) * 100;
      return Math.min(
        100,
        Math.max(0, alert.condition === "above" ? progress : 100 - progress),
      );
    }
    return 50; // For percentage alerts
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
        isHovered
          ? "border-blue-500 shadow-lg shadow-blue-500/10"
          : "border-gray-700"
      } ${alert.triggeredAt ? "opacity-60" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">
                  {alert.symbol}
                </span>
                <span className="text-gray-500 text-sm">/USDT</span>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  alert.triggeredAt
                    ? "bg-green-500/20 text-green-500"
                    : alert.isActive
                      ? "bg-blue-500/20 text-blue-500"
                      : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
            </div>

            <p className="text-gray-300 mb-2">
              Alert when price{" "}
              <span className="text-white font-semibold">
                {getConditionText()}
              </span>
            </p>

            {alert.isActive && !alert.triggeredAt && alert.currentPrice && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Current: ${formatPrice(alert.currentPrice)}</span>
                  <span>Target: ${formatPrice(alert.targetValue)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      alert.condition === "above"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>
                Created: {new Date(alert.createdAt).toLocaleDateString()}
              </span>
              {alert.triggeredAt && (
                <span className="text-green-500/70">
                  Triggered: {new Date(alert.triggeredAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {onToggle && alert.isActive && !alert.triggeredAt && (
              <button
                onClick={() => onToggle(alert.id, false)}
                className="p-2 text-gray-500 hover:text-yellow-500 transition rounded-lg hover:bg-gray-700"
                title="Pause Alert"
              >
                <FaClock size={14} />
              </button>
            )}
            {onToggle && !alert.isActive && !alert.triggeredAt && (
              <button
                onClick={() => onToggle(alert.id, true)}
                className="p-2 text-gray-500 hover:text-green-500 transition rounded-lg hover:bg-gray-700"
                title="Activate Alert"
              >
                <FaBell size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(alert.id)}
              className="p-2 text-gray-500 hover:text-red-500 transition rounded-lg hover:bg-gray-700"
              title="Delete Alert"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>

        {alert.isActive &&
          !alert.triggeredAt &&
          alert.currentPrice &&
          Math.abs(alert.currentPrice - alert.targetValue) / alert.targetValue <
            0.01 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded">
              <FaExclamationTriangle size={12} />
              <span>
                Alert will trigger soon! Price is within 1% of target.
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
