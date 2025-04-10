// app/dashboard/layout.tsx (mobile-friendly sidebar)
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSettings, FiUsers, FiDollarSign, FiCalendar, FiBox, FiStar, FiClipboard } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      {!isSidebarOpen && isMobile && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg"
        >
          <FiMenu className="text-xl" />
        </motion.button>
      )}

      {/* Animated Sidebar */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <motion.nav
            initial={{ x: isMobile ? '-100%' : 0 }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className={`h-screen bg-white shadow-xl overflow-y-auto ${
              isMobile ? 'fixed inset-y-0 left-0 w-64 z-40' : 'w-64'
            }`}
          >
            <div className="p-6 space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  SalonMaster
                </h1>
                {isMobile && (
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <FiX className="text-xl" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {[
                  { icon: <FiCalendar />, label: "Appointments", href: "#" },
                  { icon: <FiDollarSign />, label: "Finance", href: "#" },
                  { icon: <FiUsers />, label: "Clients", href: "#" },
                  { icon: <FiBox />, label: "Inventory", href: "#" },
                  { icon: <FiClipboard />, label: "Services", href: "#" },
                  { icon: <FiStar />, label: "Feedback", href: "#" },
                  { icon: <FiSettings />, label: "Settings", href: "#" },
                ].map((item) => (
                  <motion.div whileHover={{ x: 5 }} key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 text-gray-600 hover:text-purple-600"
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 p-4 lg:p-8 transition-all ${
        !isMobile && isSidebarOpen ? 'ml-64' : ''
      }`}>
        {children}
      </main>
    </div>
  );
}