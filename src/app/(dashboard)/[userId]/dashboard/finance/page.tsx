// app/dashboard/finance/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Range, RangeKeyDict } from "react-date-range";
import { FiDollarSign, FiUsers, FiBox, FiDownload } from "react-icons/fi";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface FinancialData {
  branches: Array<{
    branchId: string;
    branchName: string;
    earnings: number;
    staffSalaries: number;
    productCosts: number;
    netProfit: number;
  }>;
  totals: {
    earnings: number;
    staffSalaries: number;
    productCosts: number;
    netProfit: number;
  };
  trendData: Array<{
    date: string;
    amount: number;
  }>;
}

const FinancialPage = () => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [salonId, setSalonId] = useState("");
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    const fetchSalonId = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
        );
        setSalonId(response.data.user?.salonId);
      } catch (error) {
        console.error("Error fetching salon ID:", error);
      }
    };

    fetchSalonId();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!salonId) return;

      try {
        setScreenLoaderToggle(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/finance/financialreport`,
          {
            salonId,
            startDate: dateRange[0].startDate,
            endDate: dateRange[0].endDate,
          }
        );

        setFinancialData(response.data.data);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setScreenLoaderToggle(false);
      }
    };

    fetchData();
  }, [salonId, dateRange]);

  const handleDateChange = (ranges: RangeKeyDict) => {
    setDateRange([ranges.selection]);
  };

  const exportReport = () => {
    // Implement export logic using financialData
  };

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  if (!financialData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 mb-14"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Financial Overview
          </h1>
          <p className="text-gray-600 mt-2">
            {format(dateRange[0].startDate || 0, "MMM dd, yyyy")} -{" "}
            {format(dateRange[0].endDate || 0, "MMM dd, yyyy")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={exportReport}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg"
        >
          <FiDownload className="text-lg" />
          Export Report
        </motion.button>
      </div>

      {/* Total Earnings Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-2xl text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Net Profit After Deductions</h2>
            <p className="text-4xl font-bold mt-2">
              ${financialData.totals.netProfit.toLocaleString()}
            </p>
            <p className="mt-2 opacity-90">
              (Total Earnings - Staff Salaries - Product Costs)
            </p>
          </div>
          <FiDollarSign className="text-6xl opacity-50" />
        </div>
      </motion.div>

      {/* Date Picker & Graph Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
        <div className="[&_.rdrMonth]:w-full [&_.rdrCalendarWrapper]:bg-white">
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="w-full"
            rangeColors={["#8B5CF6"]}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Earnings Trend</h3>
        <div className="h-64">
          <LineChartComponent data={financialData.trendData} />
        </div>
      </div>

      {/* Branch-wise Breakdown */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">Branch Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financialData.branches.map((branch) => (
            <motion.div
              key={branch.branchId}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold">{branch.branchName}</h4>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Earnings:</span>
                      <span className="font-medium">
                        ${branch.earnings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Staff Salaries:</span>
                      <span className="text-red-500">
                        -${branch.staffSalaries.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Costs:</span>
                      <span className="text-red-500">
                        -${branch.productCosts.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="font-semibold">Net Profit:</span>
                      <span className="font-bold text-purple-600">
                        ${branch.netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Expense Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Expense Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiUsers className="text-2xl text-purple-600" />
              <div>
                <p className="text-gray-600">Total Staff Salaries</p>
                <p className="text-2xl font-bold">
                  ${financialData.totals.staffSalaries.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiBox className="text-2xl text-pink-600" />
              <div>
                <p className="text-gray-600">Product Costs</p>
                <p className="text-2xl font-bold">
                  ${financialData.totals.productCosts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-2xl text-emerald-600" />
              <div>
                <p className="text-gray-600">Net Profit Margin</p>
                <p className="text-2xl font-bold">
                  {(
                    (financialData.totals.netProfit /
                      financialData.totals.earnings) *
                      100 || 0
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LineChartComponent = ({
  data,
}: {
  data: Array<{ date: string; amount: number }>;
}) => {
  const chartData = {
    labels: data.map((item) => format(new Date(item.date), "MMM dd")),
    datasets: [
      {
        label: "Daily Earnings",
        data: data.map((item) => item.amount),
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  // Fixed options with proper Chart.js types
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#374151",
          font: {
            size: 14,
            weight: 600 as number,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#E5E7EB",
        borderColor: "#4B5563",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        grid: {
          display: false,
          color: "#E5E7EB",
        },
        ticks: {
          color: "#6B7280",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        type: "linear" as const,
        grid: {
          color: "#E5E7EB",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          callback: (value: number | string) =>
            `$${Number(value).toLocaleString()}`,
        },
        beginAtZero: true,
      },
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No data available for the selected period
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
};

export default FinancialPage;
