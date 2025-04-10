// app/dashboard/layout.tsx
'use client';

import { motion } from 'framer-motion';
import { FiMenu, FiX, FiSettings, FiUsers, FiDollarSign, FiCalendar, FiBox, FiStar, FiClipboard } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Animated Sidebar */}
      <motion.nav
        animate={{ width: isSidebarOpen ? 240 : 0 }}
        className="h-screen bg-white shadow-xl overflow-hidden"
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              SalonMaster
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-purple-600"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { icon: <FiCalendar />, label: 'Appointments', href: '#' },
              { icon: <FiDollarSign />, label: 'Finance', href: '#' },
              { icon: <FiUsers />, label: 'Clients', href: '#' },
              { icon: <FiBox />, label: 'Inventory', href: '#' },
              { icon: <FiClipboard />, label: 'Services', href: '#' },
              { icon: <FiStar />, label: 'Feedback', href: '#' },
              { icon: <FiSettings />, label: 'Settings', href: '#' },
            ].map((item) => (
              <motion.div whileHover={{ x: 5 }} key={item.label}>
                <Link href={item.href} className="flex items-center gap-3 p-3 text-gray-600 hover:text-purple-600">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}