"use client";

import { useState, useEffect } from "react";
import { Alert, AlertFormData } from "@/types/crypto";
import { AlertForm } from "@/components/alerts/AlertForm";
import { AlertList } from "@/components/alerts/AlertList";
import { AlertItem } from "@/components/alerts/AlertItem";
import {
  FaPlus,
  FaBell,
  FaHistory,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "triggered" | "inactive"
  >("all");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    triggered: 0,
    inactive: 0,
  });

  // Mock data - will be replaced with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAlerts: Alert[] = [
        {
          id: "1",
          symbol: "BTC",
          type: "price",
          condition: "above",
          targetValue: 55000,
          isActive: true,
          createdAt: new Date("2024-01-15"),
          currentPrice: 52345,
        },
        {
          id: "2",
          symbol: "ETH",
          type: "percentage",
          condition: "below",
          targetValue: -5,
          isActive: true,
          createdAt: new Date("2024-01-14"),
          currentPrice: 3120,
        },
        {
          id: "3",
          symbol: "SOL",
          type: "price",
          condition: "below",
          targetValue: 80,
          isActive: true,
          createdAt: new Date("2024-01-13"),
          currentPrice: 98.76,
        },
        {
          id: "4",
          symbol: "ADA",
          type: "percentage",
          condition: "above",
          targetValue: 10,
          isActive: false,
          createdAt: new Date("2024-01-12"),
          currentPrice: 0.543,
        },
        {
          id: "5",
          symbol: "DOGE",
          type: "price",
          condition: "above",
          targetValue: 0.15,
          isActive: true,
          createdAt: new Date("2024-01-11"),
          currentPrice: 0.123,
        },
        {
          id: "6",
          symbol: "BTC",
          type: "price",
          condition: "below",
          targetValue: 48000,
          isActive: false,
          createdAt: new Date("2024-01-10"),
          triggeredAt: new Date("2024-01-09"),
          currentPrice: 52345,
        },
        {
          id: "7",
          symbol: "ETH",
          type: "price",
          condition: "above",
          targetValue: 3500,
          isActive: true,
          createdAt: new Date("2024-01-09"),
          currentPrice: 3120,
        },
      ];
      setAlerts(mockAlerts);
      calculateStats(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const calculateStats = (alertsList: Alert[]) => {
    setStats({
      total: alertsList.length,
      active: alertsList.filter((a) => a.isActive && !a.triggeredAt).length,
      triggered: alertsList.filter((a) => a.triggeredAt).length,
      inactive: alertsList.filter((a) => !a.isActive && !a.triggeredAt).length,
    });
  };

  const handleCreateAlert = (alertData: AlertFormData) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      ...alertData,
      isActive: true,
      createdAt: new Date(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    calculateStats([newAlert, ...alerts]);
    setShowCreateForm(false);
    toast.success(`Alert created for ${alertData.symbol}!`, {
      icon: "🔔",
      duration: 3000,
    });
  };

  const handleDeleteAlert = (id: string) => {
    const deletedAlert = alerts.find((a) => a.id === id);
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    calculateStats(alerts.filter((a) => a.id !== id));
    toast.success(`Alert for ${deletedAlert?.symbol} deleted`, {
      icon: "🗑️",
    });
  };

  const handleToggleAlert = (id: string, isActive: boolean) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isActive } : alert)),
    );
    calculateStats(alerts.map((a) => (a.id === id ? { ...a, isActive } : a)));
    toast.success(`Alert ${isActive ? "activated" : "paused"}`, {
      icon: isActive ? "✅" : "⏸️",
    });
  };

  const handleBulkDelete = () => {
    const confirmed = window.confirm(`Delete ${filteredAlerts.length} alerts?`);
    if (confirmed) {
      setAlerts((prev) =>
        prev.filter((alert) => !filteredAlerts.some((a) => a.id === alert.id)),
      );
      calculateStats(
        alerts.filter(
          (alert) => !filteredAlerts.some((a) => a.id === alert.id),
        ),
      );
      toast.success(`${filteredAlerts.length} alerts deleted`);
    }
  };

  const handleDeleteAllTriggered = () => {
    const triggeredAlerts = alerts.filter((a) => a.triggeredAt);
    if (triggeredAlerts.length === 0) {
      toast.error("No triggered alerts to delete");
      return;
    }
    const confirmed = window.confirm(
      `Delete ${triggeredAlerts.length} triggered alerts?`,
    );
    if (confirmed) {
      setAlerts((prev) => prev.filter((alert) => !alert.triggeredAt));
      calculateStats(alerts.filter((a) => !a.triggeredAt));
      toast.success(`${triggeredAlerts.length} triggered alerts deleted`);
    }
  };

  const getUniqueSymbols = () => {
    const symbols = alerts.map((a) => a.symbol);
    return ["all", ...new Set(symbols)];
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === "active")
      return alert.isActive && !alert.triggeredAt;
    if (selectedFilter === "triggered") return alert.triggeredAt;
    if (selectedFilter === "inactive")
      return !alert.isActive && !alert.triggeredAt;
    if (selectedSymbol !== "all") return alert.symbol === selectedSymbol;
    return true;
  });

  const StatCard = ({ title, value, icon, color, onClick }: any) => (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-xl p-6 cursor-pointer transition-all hover:scale-105 ${onClick ? "hover:bg-gray-750" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
            <p className="text-gray-400 mt-1">
              Get notified when cryptocurrencies reach your targets
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg hover:shadow-xl"
          >
            <FaPlus size={14} />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className="mb-8">
          <AlertForm
            onSubmit={handleCreateAlert}
            onClose={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Alerts"
          value={stats.total}
          icon={<FaBell size={20} />}
          color="bg-blue-500/20 text-blue-500"
          onClick={() => setSelectedFilter("all")}
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={<FaCheckCircle size={20} />}
          color="bg-green-500/20 text-green-500"
          onClick={() => setSelectedFilter("active")}
        />
        <StatCard
          title="Triggered"
          value={stats.triggered}
          icon={<FaHistory size={20} />}
          color="bg-purple-500/20 text-purple-500"
          onClick={() => setSelectedFilter("triggered")}
        />
        <StatCard
          title="Inactive"
          value={stats.inactive}
          icon={<FaClock size={20} />}
          color="bg-gray-500/20 text-gray-500"
          onClick={() => setSelectedFilter("inactive")}
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                selectedFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                selectedFilter === "active"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSelectedFilter("triggered")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                selectedFilter === "triggered"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Triggered
            </button>
            <button
              onClick={() => setSelectedFilter("inactive")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                selectedFilter === "inactive"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getUniqueSymbols().map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol === "all" ? "All Coins" : `${symbol}/USDT`}
                </option>
              ))}
            </select>

            {filteredAlerts.length > 0 && selectedFilter !== "triggered" && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-sm transition"
              >
                <FaTrash size={14} />
              </button>
            )}

            {stats.triggered > 0 && (
              <button
                onClick={handleDeleteAllTriggered}
                className="px-3 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-lg text-sm transition"
              >
                Clear Triggered
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <div className="inline-block p-4 bg-gray-700 rounded-full mb-4">
            <FaBell className="text-gray-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No alerts found
          </h3>
          <p className="text-gray-400 mb-4">
            {selectedFilter !== "all"
              ? `You don't have any ${selectedFilter} alerts`
              : "Create your first alert to start monitoring"}
          </p>
          {selectedFilter !== "all" ? (
            <button
              onClick={() => setSelectedFilter("all")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              View all alerts
            </button>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Create Alert
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onDelete={handleDeleteAlert}
              onToggle={handleToggleAlert}
            />
          ))}
        </div>
      )}

      {/* Tips Section */}
      {alerts.length > 0 && (
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <FaChartLine className="text-blue-500 text-xl" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Pro Tips</h4>
              <p className="text-gray-400 text-sm">
                • Set alerts at key support/resistance levels for better entries
                <br />
                • Use percentage alerts for volatile coins to avoid noise
                <br />• Combine multiple alerts to confirm trend reversals
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
