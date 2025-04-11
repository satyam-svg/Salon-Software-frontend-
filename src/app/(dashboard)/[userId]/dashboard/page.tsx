"use client";
import {
  AreaChartComponent,
  BarChartComponent,
  LineChartComponent,
} from "@/Components/dashboard/Charts";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiUserPlus,
  FiCalendar,
  FiSettings,
  FiUsers,
  FiBox,
  FiClipboard,
  FiStar,
} from "react-icons/fi";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

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

interface NavCardProps {
  icon: ReactNode;
  label: string;
  href: string;
  description: string;
}

const DashboardPage = () => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const navigationOptions = [
    {
      icon: <FiCalendar className="text-2xl" />,
      label: "Appointments Management",
      href: `/${userId}/dashboard/Appointement`,
      description: "Manage bookings and schedule appointments with clients",
    },
    {
      icon: <FiDollarSign className="text-2xl" />,
      label: "Finance Management",
      href: "#",
      description: "Track transactions, invoices, and financial reports",
    },
    {
      icon: <FiUsers className="text-2xl" />,
      label: "Clients Management",
      href: "#",
      description: "View client profiles and manage relationships",
    },
    {
      icon: <FiBox className="text-2xl" />,
      label: "Inventory Management",
      href: "#",
      description: "Monitor stock levels and product management",
    },
    {
      icon: <FiClipboard className="text-2xl" />,
      label: "Services Management",
      href: "#",
      description: "Edit service offerings and pricing structures",
    },
    {
      icon: <FiStar className="text-2xl" />,
      label: "Feedback Management",
      href: "#",
      description: "Analyze customer reviews and ratings",
    },
  ];

  const statsData = [
    {
      icon: <FiDollarSign className="text-white text-xl" />,
      title: "Monthly Revenue",
      value: "$12,450",
      trend: "+15% from last month",
      color: "from-purple-600 to-pink-500",
    },
    {
      icon: <FiUserPlus className="text-white text-xl" />,
      title: "New Clients",
      value: "84",
      trend: "+23% from last month",
      color: "from-emerald-500 to-cyan-500",
    },
    {
      icon: <FiCalendar className="text-white text-xl" />,
      title: "Appointments",
      value: "216",
      trend: "+8% from last month",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const chartsData = [
    { title: "Financial Overview", component: <LineChartComponent /> },
    { title: "Client Growth", component: <BarChartComponent /> },
    { title: "Appointment Trends", component: <AreaChartComponent /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 px-6 mb-20"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white shadow-lg"
        >
          <FiSettings className="text-xl text-gray-600" />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.3 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {chartsData.map((chart, index) => (
          <motion.div
            key={chart.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.5 }}
          >
            <ChartCard title={chart.title}>{chart.component}</ChartCard>
          </motion.div>
        ))}
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationOptions.map((item, index) => (
          <NavCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            description={item.description}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

const NavCard = ({
  icon,
  label,
  href,
  description,
  index,
}: NavCardProps & { index: number }) => (
  <motion.a
    href={href}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 + 0.7 }}
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-indigo-600 group-hover:to-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{label}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
    <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-blue-500 text-sm font-medium">Explore →</span>
    </div>
  </motion.a>
);

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

export default DashboardPage;
