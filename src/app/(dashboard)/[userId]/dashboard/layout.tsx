// app/dashboard/layout.tsx
"use client";

import { motion } from "framer-motion";
import {
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiBox,
  FiStar,
  FiClipboard,
} from "react-icons/fi";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Animated Sidebar */}
      <motion.nav
        animate={{}}
        className="h-screen bg-white shadow-xl overflow-hidden"
      >
        <div className="p-6 space-y-8">
          <div className="space-y-4 mt-15">
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
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 p-8 mt-16">{children}</main>
    </div>
  );
}
