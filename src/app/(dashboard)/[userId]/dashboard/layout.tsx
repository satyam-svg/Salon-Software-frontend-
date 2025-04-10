"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiChevronLeft,
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiBox,
  FiStar,
  FiClipboard,
} from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const arrowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (deltaX > 30 && !isSidebarOpen) {
      setIsSidebarOpen(true);
    } else if (deltaX < -30 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Global scrollbar hide styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          background: transparent;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Animated Arrow Handle */}
      {isMobile && !isSidebarOpen && (
        <motion.button
          ref={arrowRef}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-purple-600 text-white rounded-r-full shadow-lg"
        >
          <FiChevronRight className="text-lg" />
        </motion.button>
      )}

      {/* Swipeable Sidebar */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <motion.nav
            initial={{ x: isMobile ? "-100%" : 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`h-full bg-white shadow-xl ${
              isMobile ? "fixed inset-y-0 left-0 w-64 z-40" : "w-64"
            } overflow-y-auto`}
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-end">
                {isMobile && (
                  <motion.button
                    onClick={() => setIsSidebarOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-500 hover:text-purple-600 p-2"
                  >
                    <FiChevronLeft className="text-xl" />
                  </motion.button>
                )}
              </div>

              <div className="space-y-4 mt-10">
                {[
                  { icon: <FiCalendar />, label: "Appointments", href: "#" },
                  { icon: <FiDollarSign />, label: "Finance", href: "#" },
                  { icon: <FiUsers />, label: "Clients", href: "#" },
                  { icon: <FiBox />, label: "Inventory", href: "#" },
                  { icon: <FiClipboard />, label: "Services", href: "#" },
                  { icon: <FiStar />, label: "Feedback", href: "#" },
                  { icon: <FiSettings />, label: "Settings", href: "#" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
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

      {/* Main Content Area */}
      <motion.main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 h-full overflow-auto p-4 lg:p-8 mt-11 ${
          !isMobile && isSidebarOpen ? "ml-64" : ""
        }`}
      >
        {children}
      </motion.main>
    </div>
  );
}
