"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaBell,
  FaCog,
  FaWallet,
  FaHistory,
  FaStar,
  FaQuestionCircle,
  FaSignOutAlt,
  FaExchangeAlt,
  FaRobot,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaChartLine size={18} /> },
    { path: "/alerts", label: "Alerts", icon: <FaBell size={18} />, badge: 3 },
    { path: "/portfolio", label: "Portfolio", icon: <FaWallet size={18} /> },
    {
      path: "/transactions",
      label: "Transactions",
      icon: <FaHistory size={18} />,
    },
    { path: "/watchlist", label: "Watchlist", icon: <FaStar size={18} /> },
    { path: "/exchange", label: "Exchange", icon: <FaExchangeAlt size={18} /> },
    { path: "/bots", label: "Trading Bots", icon: <FaRobot size={18} /> },
  ];

  const bottomMenuItems = [
    { path: "/settings", label: "Settings", icon: <FaCog size={18} /> },
    { path: "/help", label: "Help", icon: <FaQuestionCircle size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 z-50 transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse Toggle Button */}
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full p-1.5 border border-gray-600 shadow-lg transition-all duration-200 z-10 hidden lg:block"
          >
            {isOpen ? (
              <FaChevronLeft size={14} />
            ) : (
              <FaChevronRight size={14} />
            )}
          </button>

          {/* Logo Area */}
          <div
            className={`p-4 border-b border-gray-700 transition-all duration-300 ${!isOpen && "px-2"}`}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
                <FaChartLine className="text-white text-lg" />
              </div>
              {isOpen && (
                <div className="overflow-hidden whitespace-nowrap">
                  <h2 className="text-white font-bold text-sm">
                    Crypto Tracker
                  </h2>
                  <p className="text-xs text-gray-400">v2.0.0</p>
                </div>
              )}
            </Link>
          </div>

          {/* User Info - Collapsible version */}
          <div
            className={`p-4 border-b border-gray-700 transition-all duration-300 ${!isOpen && "px-2"}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              {isOpen && (
                <div className="overflow-hidden whitespace-nowrap">
                  <p className="text-white font-medium text-sm">John Doe</p>
                  <p className="text-xs text-gray-400">Premium Member</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {isOpen && (
              <div className="px-3 mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Main Menu
                </p>
              </div>
            )}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 group ${
                  pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                } ${!isOpen && "justify-center px-2"}`}
                title={!isOpen ? item.label : undefined}
              >
                <div
                  className={`flex items-center gap-3 ${!isOpen && "justify-center w-full"}`}
                >
                  {item.icon}
                  {isOpen && <span className="text-sm">{item.label}</span>}
                </div>
                {isOpen && item.badge && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {!isOpen && item.badge && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            ))}

            {isOpen && (
              <div className="px-3 mt-6 mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Support
                </p>
              </div>
            )}
            {bottomMenuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 group ${
                  pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                } ${!isOpen && "justify-center px-2"}`}
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div
            className={`p-4 border-t border-gray-700 transition-all duration-300 ${!isOpen && "px-2"}`}
          >
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-all duration-200 group ${
                !isOpen && "justify-center px-2"
              }`}
              title={!isOpen ? "Logout" : undefined}
            >
              <FaSignOutAlt size={18} className="flex-shrink-0" />
              {isOpen && <span className="text-sm">Logout</span>}
            </button>
            {isOpen && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">© 2024 Crypto Tracker</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
