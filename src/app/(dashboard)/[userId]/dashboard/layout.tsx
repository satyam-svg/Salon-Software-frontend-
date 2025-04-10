// app/dashboard/layout.tsx
"use client";

import {
  HiOutlineViewGrid,
  HiOutlineCurrencyDollar,
  HiOutlineScissors,
  HiOutlineMap,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineCog,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  // Animation variants

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const menuItems = [
    { name: "Dashboard", icon: <HiOutlineViewGrid className="h-5 w-5" /> },
    {
      name: "Financial",
      icon: <HiOutlineCurrencyDollar className="h-5 w-5" />,
    },
    { name: "Services", icon: <HiOutlineScissors className="h-5 w-5" /> },
    { name: "Branches", icon: <HiOutlineMap className="h-5 w-5" /> },
    { name: "Clients", icon: <HiOutlineUsers className="h-5 w-5" /> },
    { name: "Staff", icon: <HiOutlineBriefcase className="h-5 w-5" /> },
    { name: "Settings", icon: <HiOutlineCog className="h-5 w-5" /> },
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#fff9f7] to-[#f5e8e5] relative overflow-hidden">
      {/* Animated Sidebar */}
      <motion.aside
        ref={ref}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#e8c4c0] bg-gradient-to-b from-[#2a1a1f] to-[#3d252d] shadow-2xl"
      >
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex h-20 items-center justify-center border-b border-[#4d323a] hover:bg-[#3d252d] transition-all"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white tracking-tighter"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            <span className="text-[#b76e79]">SALON</span>SPHERE
          </motion.span>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              whileHover={{
                x: 10,
                backgroundColor: "#4d323a",
                boxShadow: "0 4px 15px -3px rgba(183, 110, 121, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3.5 text-sm font-medium
                       text-[#e8c4c0] hover:text-white transition-all group relative"
            >
              <motion.span
                className="absolute left-0 w-1 h-6 bg-[#b76e79] rounded-r-full opacity-0 group-hover:opacity-100"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              {item.icon}
              <motion.span
                className="group-hover:drop-shadow-[0_2px_2px_rgba(183,110,121,0.4)]"
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.name} Management
              </motion.span>
            </motion.button>
          ))}
        </nav>

        {/* Profile Section */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 border-t border-[#4d323a] p-4 bg-[#3d252d]/50 backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className="h-10 w-10 rounded-full bg-[#4d323a] flex items-center justify-center"
            >
              <HiOutlineUserCircle className="h-6 w-6 text-[#b76e79]" />
            </motion.div>
            <div className="transition-all">
              <p className="text-sm font-medium text-white group-hover:text-[#e8c4c0]">
                Salonsphere Admin
              </p>
              <p className="text-xs text-[#a78a8f] group-hover:text-[#d8b4b9]">
                admin@salonsphere.com
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Sidebar Elements */}
        <motion.div
          className="absolute top-1/3 -right-6 w-12 h-12 bg-[#b76e79] rounded-full blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.aside>

      {/* Main Content Area */}
      <main className="ml-64 h-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-full pb-8 relative"
        >
          {/* Animated Header */}

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-8 pt-6 space-y-6"
          >
            {children}
          </motion.div>
        </motion.div>
      </main>

      {/* Background Effects */}
      <motion.div
        className="fixed top-20 right-10 w-32 h-32 rounded-full bg-[#e8c4c0] opacity-20 mix-blend-multiply filter blur-xl animate-blob"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
      />
    </div>
  );
}
