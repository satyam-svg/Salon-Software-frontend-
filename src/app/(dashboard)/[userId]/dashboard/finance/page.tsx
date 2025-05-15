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
import { saveAs } from "file-saver";
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

// Salon Theme Config
const SALON_THEME = {
  primary: "#b76e79",
  secondary: "#e8c4c0",
  accent: "#7a5a57",
  background: "#fff0ee",
  textPrimary: "#7a5a57",
  textSecondary: "#9e6d70",
};

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
    if (!financialData) return;

    // CSV Export Logic
    const csvContent = [
      "Branch Name,Earnings,Staff Salaries,Product Costs,Net Profit",
      ...financialData.branches.map(
        (branch) =>
          `${branch.branchName},${branch.earnings},${branch.staffSalaries},${branch.productCosts},${branch.netProfit}`
      ),
      `TOTAL,,${financialData.totals.staffSalaries},${financialData.totals.productCosts},${financialData.totals.netProfit}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `salon-financial-report-${new Date().toISOString()}.csv`);
  };

  if (ScreenLoaderToggle) return <Screenloader />;
  if (!financialData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 mb-14 px-4"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#7a5a57] font-dancing">
            Financial Overview
          </h1>
          <p className="text-[#9e6d70] mt-2">
            {format(dateRange[0].startDate || 0, "MMM dd, yyyy")} -{" "}
            {format(dateRange[0].endDate || 0, "MMM dd, yyyy")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={exportReport}
          className="flex items-center gap-2 bg-[#b76e79] text-white px-6 py-3 rounded-lg hover:bg-[#9e6d70] transition-colors"
        >
          <FiDownload className="text-lg" />
          Export Report
        </motion.button>
      </div>

      {/* Net Profit Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] p-6 rounded-2xl text-white shadow-lg"
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

      {/* Date Picker Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8c4c0]">
        <h3 className="text-lg font-semibold mb-4 text-[#7a5a57]">
          Select Date Range
        </h3>
        <div className="[&_.rdrMonth]:w-full [&_.rdrCalendarWrapper]:bg-white">
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="w-full"
            rangeColors={[SALON_THEME.primary]}
          />
        </div>
      </div>

      {/* Earnings Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8c4c0]">
        <h3 className="text-lg font-semibold mb-4 text-[#7a5a57]">
          Earnings Trend
        </h3>
        <div className="h-64">
          <LineChartComponent data={financialData.trendData} />
        </div>
      </div>

      {/* Branch-wise Breakdown */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#7a5a57] font-dancing">
          Branch Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financialData.branches.map((branch) => (
            <motion.div
              key={branch.branchId}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-[#e8c4c0]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-[#7a5a57]">
                    {branch.branchName}
                  </h4>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-[#9e6d70]">Earnings:</span>
                      <span className="font-medium text-[#7a5a57]">
                        ${branch.earnings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9e6d70]">Staff Salaries:</span>
                      <span className="text-red-500">
                        -${branch.staffSalaries.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9e6d70]">Product Costs:</span>
                      <span className="text-red-500">
                        -${branch.productCosts.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-[#e8c4c0]">
                      <span className="font-semibold text-[#7a5a57]">
                        Net Profit:
                      </span>
                      <span className="font-bold text-[#b76e79]">
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

      {/* Expense Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8c4c0]">
        <h3 className="text-xl font-semibold mb-6 text-[#7a5a57]">
          Expense Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-[#fff0ee] rounded-lg">
            <div className="flex items-center gap-3">
              <FiUsers className="text-2xl text-[#b76e79]" />
              <div>
                <p className="text-[#9e6d70]">Total Staff Salaries</p>
                <p className="text-2xl font-bold text-[#7a5a57]">
                  ${financialData.totals.staffSalaries.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#fff0ee] rounded-lg">
            <div className="flex items-center gap-3">
              <FiBox className="text-2xl text-[#b76e79]" />
              <div>
                <p className="text-[#9e6d70]">Product Costs</p>
                <p className="text-2xl font-bold text-[#7a5a57]">
                  ${financialData.totals.productCosts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#fff0ee] rounded-lg">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-2xl text-[#b76e79]" />
              <div>
                <p className="text-[#9e6d70]">Net Profit Margin</p>
                <p className="text-2xl font-bold text-[#7a5a57]">
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
        borderColor: SALON_THEME.primary,
        backgroundColor: "#e8c4c040",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: SALON_THEME.textPrimary,
          font: { size: 14, weight: 600 },
        },
      },
      tooltip: {
        backgroundColor: SALON_THEME.background,
        titleColor: SALON_THEME.textPrimary,
        bodyColor: SALON_THEME.textSecondary,
        borderColor: SALON_THEME.secondary,
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        grid: { display: false, color: SALON_THEME.secondary },
        ticks: { color: SALON_THEME.textSecondary },
      },
      y: {
        type: "linear" as const,
        grid: { color: SALON_THEME.secondary },
        ticks: {
          color: SALON_THEME.textSecondary,
          callback: (value: number | string) =>
            `$${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[#9e6d70]">
        No data available for the selected period
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
};

export default FinancialPage;
