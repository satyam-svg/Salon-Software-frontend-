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

export default function AccountingBilling() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<{
    purchasedPlans: PurchasedPlan[];
    salesmanSalaries: SalesmanSalary[];
    totalRevenue: number;
    totalPlans: number;
  }>({
    purchasedPlans: [],
    salesmanSalaries: [],
    totalRevenue: 0,
    totalPlans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/accounting");
        setData(response.data);
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
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">{data.totalPlans}</div>
                <div className="text-sm text-gray-500">Total Plans Bought</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="flex gap-4 border-b border-gray-200 mb-6">
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 0
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500"
              }`}
            >
              <FiUsers className="inline mr-2" /> Plans Bought
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 1
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500"
              }`}
            >
              <FiDollarSign className="inline mr-2" /> Salesman Salaries
            </Tab>
          </TabList>

          {/* Plans Bought Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.purchasedPlans.map((plan, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{plan.userName}</td>
                      <td className="px-6 py-4">{plan.planName}</td>
                      <td className="px-6 py-4">{formatCurrency(plan.planPrice)}</td>
                      <td className="px-6 py-4">
                        {new Date(plan.buyDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Salesman Salaries Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Salesman</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.salesmanSalaries.map((salary, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{salary.salesmanName}</td>
                      <td className="px-6 py-4">{formatCurrency(salary.amount)}</td>
                      <td className="px-6 py-4">
                        {new Date(salary.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}