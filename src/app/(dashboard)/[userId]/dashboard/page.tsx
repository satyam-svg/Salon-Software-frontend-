// app/dashboard/page.tsx
"use client";
import {
  AreaChartComponent,
  BarChartComponent,
  LineChartComponent,
} from "@/Components/Charts";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiUserPlus,
  FiCalendar,
  FiSettings,
  FiBox,
  FiUsers,
} from "react-icons/fi";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
  color: string;
}

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  color: string;
}

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-full bg-white shadow"
          >
            <FiSettings className="text-xl text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<FiDollarSign className="text-white text-xl" />}
          title="Monthly Revenue"
          value="$12,450"
          trend="+15% from last month"
          color="from-purple-600 to-pink-500"
        />
        <StatCard
          icon={<FiUserPlus className="text-white text-xl" />}
          title="New Clients"
          value="84"
          trend="+23% from last month"
          color="from-emerald-500 to-cyan-500"
        />
        <StatCard
          icon={<FiCalendar className="text-white text-xl" />}
          title="Appointments"
          value="216"
          trend="+8% from last month"
          color="from-amber-500 to-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Financial Overview">
          <LineChartComponent />
        </ChartCard>

        <ChartCard title="Client Growth">
          <BarChartComponent />
        </ChartCard>

        <ChartCard title="Appointment Trends">
          <AreaChartComponent />
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon={<FiCalendar className="text-xl" />}
          title="New Appointment"
          color="bg-purple-100 text-purple-600"
        />
        <QuickActionCard
          icon={<FiUsers className="text-xl" />}
          title="Add Client"
          color="bg-emerald-100 text-emerald-600"
        />
        <QuickActionCard
          icon={<FiBox className="text-xl" />}
          title="Manage Inventory"
          color="bg-amber-100 text-amber-600"
        />
        <QuickActionCard
          icon={<FiDollarSign className="text-xl" />}
          title="View Reports"
          color="bg-cyan-100 text-cyan-600"
        />
      </div>
    </motion.div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value, trend, color }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <span className="text-sm text-green-500">{trend}</span>
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children }: ChartCardProps) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="bg-white p-6 rounded-xl shadow-sm"
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </motion.div>
);

const QuickActionCard = ({ icon, title, color }: QuickActionCardProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-xl ${color} flex items-center gap-3`}
  >
    {icon}
    <span className="font-medium">{title}</span>
  </motion.button>
);

export default DashboardPage;
