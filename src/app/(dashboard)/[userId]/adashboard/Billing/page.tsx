"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiDollarSign, FiUsers, FiTrendingUp, FiPlus } from "react-icons/fi";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { motion } from "framer-motion";

interface PurchasedPlan {
  userName: string;
  planName: string;
  planPrice: number;
  buyDate: string;
}

interface SalesmanSalary {
  salesmanName: string;
  amount: number;
  date: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalPlans: number;
  totalSalaries: number;
}

export default function AccountingBilling() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<{
    purchasedPlans: PurchasedPlan[];
    salesmanSalaries: SalesmanSalary[];
    financialSummary: FinancialSummary;
  }>({
    purchasedPlans: [],
    salesmanSalaries: [],
    financialSummary: {
      totalRevenue: 0,
      totalPlans: 0,
      totalSalaries: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/adminfinance/getadminfinance`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">
          Loading financial data...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiDollarSign className="text-green-500" /> Accounting & Billing
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Revenue Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiTrendingUp className="text-green-600 text-2xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.financialSummary.totalRevenue)}
                </div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
          </motion.div>

          {/* Total Plans Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {data.financialSummary.totalPlans}
                </div>
                <div className="text-sm text-gray-500">Total Plans Sold</div>
              </div>
            </div>
          </motion.div>

          {/* Total Salaries Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiDollarSign className="text-purple-600 text-2xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.financialSummary.totalSalaries)}
                </div>
                <div className="text-sm text-gray-500">Total Salaries Paid</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="flex gap-4 border-b border-gray-200 mb-6">
            <Tab
              className={`py-2 px-4 cursor-pointer transition-colors ${
                activeTab === 0
                  ? "border-b-2 border-green-500 text-green-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiUsers className="inline mr-2" /> Plans Bought
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer transition-colors ${
                activeTab === 1
                  ? "border-b-2 border-green-500 text-green-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiDollarSign className="inline mr-2" /> Salesman Salaries
            </Tab>
          </TabList>

          {/* Plans Bought Tab */}
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Purchase Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.purchasedPlans.map((plan, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{plan.userName}</td>
                      <td className="px-6 py-4">{plan.planName}</td>
                      <td className="px-6 py-4">
                        {formatCurrency(plan.planPrice)}
                      </td>
                      <td className="px-6 py-4">{formatDate(plan.buyDate)}</td>
                    </tr>
                  ))}
                  {data.purchasedPlans.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No purchased plans found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </TabPanel>

          {/* Salesman Salaries Tab */}
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Salesman
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.salesmanSalaries.map((salary, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{salary.salesmanName}</td>
                      <td className="px-6 py-4">
                        {formatCurrency(salary.amount)}
                      </td>
                      <td className="px-6 py-4">{formatDate(salary.date)}</td>
                    </tr>
                  ))}
                  {data.salesmanSalaries.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No salary records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
