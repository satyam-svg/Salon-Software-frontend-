"use client";
import {
  AreaChartComponent,
  BarChartComponent,
  LineChartComponent,
} from "@/Components/dashboard/Charts";
import { motion } from "framer-motion";
import { FiUserPlus, FiCalendar, FiSettings, FiCheck } from "react-icons/fi";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaRupeeSign } from "react-icons/fa";
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  trend: string;
  color: string;
}

interface ChartData {
  day: string;
  revenue: number;
  newClients: number;
  appointments: number;
}

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const featureMap: { [key: string]: string } = {
  appointments: "Appointments Management",
  finance: "Financial Tracking",
  clients: "Client Management",
  inventory: "Inventory Tracking",
  branch: "Multiple Branches",
  services: "Services Management",
  feedback: "Customer Feedback",
  staff: "Staff Management",
};

const ActivePlanCard = ({
  activePlan,
}: {
  activePlan: SubscriptionPackage | null;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, type: "spring" }}
      className="col-span-1"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] p-6 rounded-xl shadow-lg text-white relative overflow-hidden"
      >
        <div className="absolute w-32 h-32 bg-white/10 -top-16 -right-16 rounded-full" />
        <div className="absolute w-24 h-24 bg-white/10 -bottom-12 -left-12 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">
              {activePlan?.name || "No Active Plan"}
            </h3>
            <span className="text-2xl font-bold">
              {activePlan ? `₹${activePlan?.price}/mo` : "Free Tier"}
            </span>
          </div>

          <p className="mb-4 opacity-90">Your current plan includes:</p>

          <ul className="space-y-2">
            {activePlan?.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <FiCheck className="text-white" />
                <span className="text-sm">
                  {featureMap[feature] || feature}
                </span>
              </li>
            ))}

            {!activePlan && (
              <>
                <li className="flex items-center gap-2 opacity-50">
                  <FiCheck className="text-white" />
                  <span className="text-sm">Basic Appointments</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <FiCheck className="text-white" />
                  <span className="text-sm">Limited Clients</span>
                </li>
              </>
            )}
          </ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full bg-white text-[#b76e79] py-2 rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all"
          >
            {activePlan ? "Manage Plan" : "Upgrade Now"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [revenue, setRevenue] = useState(0);
  const [, setSalonId] = useState("");
  const [clients, setClients] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activePlan, setActivePlan] = useState<SubscriptionPackage | null>(
    null
  );
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setScreenLoaderToggle(true);

        // Fetch user data
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();

        // Fetch active plan
        if (userData.user?.activePlanId) {
          const planRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/${userData.user.activePlanId}`
          );
          setActivePlan(planRes.data.data);
        }

        // Fetch salon data
        if (!userData.user?.salonId) throw new Error("Salon not found");
        const salonId = userData.user.salonId;
        setSalonId(salonId);

        // Fetch other data
        const [chartRes, revenueRes, clientsRes, appointmentsRes] =
          await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}api/chart/three/${salonId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/totalprice/${salonId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/totalclients/${salonId}`
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/latestappointment/${salonId}`
            ),
          ]);

        setChartData(chartRes.data);
        setRevenue(revenueRes.data.totalRevenue);
        setClients(clientsRes.data.totalClients);
        setAppointments(appointmentsRes.data.totalAppointments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setScreenLoaderToggle(false);
      }
    };

    fetchInitialData();
  }, [userId, setScreenLoaderToggle]);

  const statsData = [
    {
      icon: <FaRupeeSign className="text-white text-xl" />,
      title: "Monthly Revenue",
      value: revenue,
      trend: "+15% from last month",
      color: "from-[#b76e79] to-[#d8a5a5]",
    },
    {
      icon: <FiUserPlus className="text-white text-xl" />,
      title: "New Clients",
      value: clients,
      trend: "+23% from last month",
      color: "from-[#9e6d70] to-[#e8c4c0]",
    },
    {
      icon: <FiCalendar className="text-white text-xl" />,
      title: "Appointments",
      value: appointments,
      trend: "+8% from last month",
      color: "from-[#7a5a57] to-[#b76e79]",
    },
  ];

  const chartsData = [
    {
      title: "Financial Overview",
      component: <LineChartComponent data={chartData} />,
    },
    {
      title: "Client Growth",
      component: <BarChartComponent data={chartData} />,
    },
    {
      title: "Appointment Trends",
      component: <AreaChartComponent data={chartData} />,
    },
  ];

  if (ScreenLoaderToggle) return <Screenloader />;

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
        transition={{ delay: 0.2, type: "spring" }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-[#7a5a57] font-dancing">
          Salon Dashboard Overview
        </h1>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-[#fff0ee] border border-[#e8c4c0] shadow-sm"
        >
          <FiSettings className="text-xl text-[#b76e79]" />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.2 + 0.3,
              type: "spring",
              stiffness: 100,
            }}
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
            transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
          >
            <ChartCard title={chart.title}>{chart.component}</ChartCard>
          </motion.div>
        ))}
      </div>

      {/* Active Plan Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="col-span-1"
        >
          <ChartCard title="Performance Metrics">
            <BarChartComponent data={chartData} />
          </ChartCard>
        </motion.div>

        <ActivePlanCard activePlan={activePlan} />
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, trend, color }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-[#e8c4c0]"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color} shadow-md`}>
        {icon}
      </div>
      <div>
        <h3 className="text-[#7a5a57] text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-[#b76e79]">{value}</p>
        <span className="text-sm text-[#9e6d70]">{trend}</span>
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children }: ChartCardProps) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-[#e8c4c0]"
  >
    <h3 className="text-lg font-semibold mb-4 text-[#7a5a57]">{title}</h3>
    <div className="h-64 [&>canvas]:!text-[#7a5a57]">{children}</div>
  </motion.div>
);

export default DashboardPage;
