// app/dashboard/finance/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Range, RangeKeyDict } from 'react-date-range';
import {
  FiDollarSign,
  FiUsers,
  FiBox,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { LineChartComponent } from "@/Components/dashboard/Charts";

const FinancialPage = () => {
    const [dateRange, setDateRange] = useState<Range[]>([
        {
          startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

  // Dummy data
  const branches = [
    {
      id: 1,
      name: "Downtown Branch",
      earnings: 15420,
      staffSalaries: 6200,
      productCosts: 2300,
      netProfit: 6920,
    },
    {
      id: 2,
      name: "Uptown Branch",
      earnings: 23450,
      staffSalaries: 9800,
      productCosts: 4100,
      netProfit: 9550,
    },
  ];

  const [filteredData, ] = useState(branches);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [dateRange]);

  const calculateTotals = () => {
    const total = filteredData.reduce(
      (acc, branch) => acc + branch.netProfit,
      0
    );
    setTotalEarnings(total);
  };

  const handleDateChange = (ranges: RangeKeyDict) => {
    setDateRange([ranges.selection]);
  };

  const exportReport = () => {
    // Export logic here
  };

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
            {format(dateRange[0].startDate ||0, "MMM dd, yyyy")} -{" "}
            {format(dateRange[0].endDate ||0, "MMM dd, yyyy")}
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
              ${totalEarnings.toLocaleString()}
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
          <LineChartComponent />
        </div>
      </div>

      {/* Branch-wise Breakdown */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">Branch Performance</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <motion.div
              key={branch.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold">{branch.name}</h4>
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

                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  Manage Staff
                  <FiChevronRight className="mt-1" />
                </motion.button>
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
                <p className="text-2xl font-bold">$16,000</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiBox className="text-2xl text-pink-600" />
              <div>
                <p className="text-gray-600">Product Costs</p>
                <p className="text-2xl font-bold">$6,400</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-2xl text-emerald-600" />
              <div>
                <p className="text-gray-600">Net Profit Margin</p>
                <p className="text-2xl font-bold">34.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialPage;
