// app/dashboard/layout.tsx
import {
  HiViewGrid,
  HiCurrencyDollar,
  HiScissors,
  HiUsers,
  HiBriefcase,
  HiCog,
  HiMap, // ✅ Replacement for HiLocationMarker
} from "react-icons/hi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { motion } from "framer-motion";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const menuItems = [
    { name: "Dashboard", icon: <HiViewGrid className="h-5 w-5" /> },
    { name: "Financial", icon: <HiCurrencyDollar className="h-5 w-5" /> },
    { name: "Services", icon: <HiScissors className="h-5 w-5" /> },
    { name: "Branches", icon: <HiMap className="h-5 w-5" /> }, // ✅ Updated
    { name: "Clients", icon: <HiUsers className="h-5 w-5" /> },
    { name: "Staff", icon: <HiBriefcase className="h-5 w-5" /> },
    { name: "Settings", icon: <HiCog className="h-5 w-5" /> },
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex h-20 items-center justify-center border-b border-slate-700 hover:bg-slate-800/50 transition-all"
        >
          <span className="text-2xl font-bold text-white tracking-tighter">
            <span className="text-rose-500">SALON</span>SPHERE
          </span>
        </motion.div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3.5 text-sm font-medium
                           text-slate-200 hover:bg-slate-700/50 hover:text-white transition-all
                           focus:outline-none focus:ring-2 focus:ring-rose-500/70"
            >
              {item.icon}
              <span>{item.name} Management</span>
            </motion.button>
          ))}
        </nav>

        {/* Profile Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4 bg-slate-800/40 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3 group cursor-pointer">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center"
            >
              <MdOutlineAdminPanelSettings className="h-6 w-6 text-rose-400" />
            </motion.div>
            <div className="transition-all">
              <p className="text-sm font-medium text-white group-hover:text-rose-100">
                Salonsphere Admin
              </p>
              <p className="text-xs text-slate-400 group-hover:text-slate-300">
                admin@salonsphere.com
              </p>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 h-full overflow-y-auto">
        <div className="min-h-full pb-8">
          <div className="h-20 w-full" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-8 pt-6"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
