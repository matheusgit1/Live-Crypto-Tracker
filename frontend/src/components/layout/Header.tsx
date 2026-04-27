"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface HeaderProps {
  isConnected?: boolean;
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

export function Header({
  isConnected = false,
  isSidebarOpen = true,
  onSidebarToggle,
  onThemeToggle,
  isDarkMode = true,
}: HeaderProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "BTC alert triggered!", time: "2 min ago", read: false },
    {
      id: 2,
      text: "ETH reached target price",
      time: "15 min ago",
      read: false,
    },
    {
      id: 3,
      text: "New all-time high for SOL",
      time: "1 hour ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button - Desktop */}
            <button
              onClick={onSidebarToggle}
              className="hidden lg:flex p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
              title={isSidebarOpen ? "Collapse menu" : "Expand menu"}
            >
              <FaBars size={18} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <FaChartLine className="text-white text-lg" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">
                  Live Crypto Tracker
                </h1>
                <p className="text-xs text-gray-400 hidden md:block">
                  Real-time monitoring
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center bg-gray-700 rounded-lg px-3 py-2 min-w-[300px]">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white ml-2 outline-none flex-1 placeholder-gray-400 text-sm"
            />
            <kbd className="hidden lg:inline text-xs text-gray-400 bg-gray-600 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              <span className="text-xs text-gray-300">
                {isConnected ? "Live" : "Connecting..."}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
              >
                <FaBell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-white font-semibold">
                        Notifications
                      </h3>
                      <button className="text-xs text-blue-500 hover:text-blue-400">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <FaBell className="text-gray-600 text-3xl mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">
                            No notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition ${
                              !notif.read ? "bg-blue-900/20" : ""
                            }`}
                          >
                            <p className="text-sm text-white">{notif.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-gray-700">
                      <button className="text-sm text-blue-500 hover:text-blue-400">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">JD</span>
                </div>
                <span className="hidden md:inline text-sm text-white">
                  John
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-white text-sm font-semibold">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-400">john@example.com</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2 text-sm">
                        <FaUser size={14} /> Profile
                      </button>
                      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2 text-sm">
                        <FaCog size={14} /> Settings
                      </button>
                      <hr className="border-gray-700 my-1" />
                      <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2 text-sm">
                        <FaSignOutAlt size={14} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3">
          <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white ml-2 outline-none flex-1 placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
