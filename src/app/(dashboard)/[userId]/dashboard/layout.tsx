"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiX,
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiBox,
  FiStar,
  FiClipboard,
  FiBarChart2,
} from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/Components/LoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const userid = pathname.split("/")[1];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      setIsLoading(true);
      if (isMobile) setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

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

      {/* Loading Screen */}
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {/* Animated Arrow Handle */}
      {isMobile && !isSidebarOpen && (
        <motion.button
          ref={arrowRef}
          onClick={() => setIsSidebarOpen(true)}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 p-3 bg-purple-600 text-white rounded-r-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <FiChevronRight className="text-xl" />
        </motion.button>
      )}

      {/* Sidebar */}
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
              <div className="space-y-4 mt-10">
                {[
                  {
                    icon: <FiBarChart2 />,
                    label: "Dashboard",
                    href: `/${userid}/dashboard/`,
                  },
                  {
                    icon: <FiCalendar />,
                    label: "Appointments",
                    href: `/${userid}/dashboard/Appointement`,
                  },
                  {
                    icon: <FiDollarSign />,
                    label: "Finance",
                    href: `/${userid}/dashboard/finance`,
                  },
                  {
                    icon: <FiUsers />,
                    label: "Clients",
                    href: `/${userid}/dashboard/Clients`,
                  },
                  {
                    icon: <FiBox />,
                    label: "Inventory",
                    href: `/${userid}/dashboard/inventory`,
                  },
                  {
                    icon: <FiClipboard />,
                    label: "Services",
                    href: `/${userid}/dashboard/service`,
                  },
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
                      onClick={() => handleNavigation(item.href)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Beautiful Animated Close Button */}
                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-10"
                  >
                    <motion.button
                      ref={closeBtnRef}
                      onClick={() => setIsSidebarOpen(false)}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#f3f4f6",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-red-500 hover:text-red-600 transition-colors"
                    >
                      <motion.span
                        animate={{
                          rotate: [0, 20, -20, 0],
                          transition: {
                            repeat: Infinity,
                            repeatType: "mirror",
                            duration: 2,
                          },
                        }}
                      >
                        <FiX className="text-xl" />
                      </motion.span>
                      <span className="font-medium">Close SideBar</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.main
        className={`flex-1 h-full overflow-auto p-4 lg:p-8 mt-15 ${
          !isMobile && isSidebarOpen ? "ml-64" : ""
        }`}
      >
        {children}
      </motion.main>
    </div>
  );
}
