// app/dashboard/page.tsx
import {
  HiBell,
  HiUsers,
  HiCurrencyDollar,
  HiScissors,
  HiCalendar,
} from "react-icons/hi";
import { motion } from "framer-motion";
import { BarChart, LineChart, PieChart } from "@components/charts"; // Create these chart components
import { Avatar } from "@components/ui/avatar";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Clients",
      value: "1,234",
      icon: <HiUsers className="h-6 w-6" />,
      color: "bg-rose-100",
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      icon: <HiCurrencyDollar className="h-6 w-6" />,
      color: "bg-emerald-100",
    },
    {
      title: "Services Booked",
      value: "326",
      icon: <HiScissors className="h-6 w-6" />,
      color: "bg-indigo-100",
    },
    {
      title: "Upcoming Appointments",
      value: "58",
      icon: <HiCalendar className="h-6 w-6" />,
      color: "bg-amber-100",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 65 },
    { month: "Feb", revenue: 59 },
    { month: "Mar", revenue: 80 },
    { month: "Apr", revenue: 81 },
    { month: "May", revenue: 56 },
    { month: "Jun", revenue: 55 },
  ];

  const serviceData = [
    { service: "Haircut", bookings: 120 },
    { service: "Massage", bookings: 86 },
    { service: "Facial", bookings: 75 },
    { service: "Manicure", bookings: 93 },
  ];

  return (
    <div className="h-full">
      {/* Animated Top Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6"
      >
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, <span className="text-rose-600">Admin</span>
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-slate-600 hover:text-slate-800 relative"
          >
            <HiBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full"></span>
          </motion.button>
          <div className="h-8 w-px bg-gray-200"></div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <Avatar src="/admin-avatar.png" fallback="SA" />
            <div>
              <p className="text-sm font-medium text-slate-800">
                Salonsphere Admin
              </p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Content Area with Proper Spacing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-8"
      >
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl ${stat.color} backdrop-blur-sm border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/50">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 bg-white rounded-xl border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Revenue Trend
            </h3>
            <div className="h-64">
              <LineChart
                data={revenueData}
                xKey="month"
                yKey="revenue"
                color="#e11d48"
              />
            </div>
          </motion.div>

          {/* Service Popularity */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 bg-white rounded-xl border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Service Popularity
            </h3>
            <div className="h-64">
              <BarChart
                data={serviceData}
                xKey="service"
                yKey="bookings"
                color="#7c3aed"
              />
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Demographics */}
          <motion.div
            className="p-6 bg-white rounded-xl border border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Client Demographics
            </h3>
            <div className="h-64">
              <PieChart
                data={[
                  { name: "Female", value: 75 },
                  { name: "Male", value: 22 },
                  { name: "Other", value: 3 },
                ]}
                colors={["#e11d48", "#3b82f6", "#10b981"]}
              />
            </div>
          </motion.div>

          {/* Recent Appointments */}
          <motion.div
            className="p-6 bg-white rounded-xl border border-gray-200 lg:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Appointments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b">
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Staff</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-3">
                        <div className="flex items-center">
                          <Avatar size="sm" className="mr-2" />
                          <span>Client {i + 1}</span>
                        </div>
                      </td>
                      <td>Haircut & Styling</td>
                      <td>Stylist {i + 1}</td>
                      <td>2:00 PM</td>
                      <td>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
