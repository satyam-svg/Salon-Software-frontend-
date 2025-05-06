"use client";
import { useState } from "react";
import {
  FiDollarSign,
  FiFileText,
  FiUsers,
  FiTrendingUp,
  FiPlus,
  FiSearch,
  FiDownload,
} from "react-icons/fi";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { motion } from "framer-motion";

export default function AccountingBilling() {
  const [activeTab, setActiveTab] = useState(0);

  // Dummy Data
  const invoices = [
    {
      id: "#INV-001",
      customer: "Glamour Studio",
      date: "2024-04-15",
      amount: 299,
      status: "Paid",
    },
    {
      id: "#INV-002",
      customer: "Urban Cuts",
      date: "2024-04-14",
      amount: 199,
      status: "Pending",
    },
    {
      id: "#INV-003",
      customer: "Luxe Beauty",
      date: "2024-04-13",
      amount: 399,
      status: "Overdue",
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "Income",
      date: "2024-04-15",
      description: "Service Payment",
      category: "Haircut",
      amount: 150,
    },
    {
      id: 2,
      type: "Expense",
      date: "2024-04-14",
      description: "Product Purchase",
      category: "Shampoo",
      amount: -45,
    },
    {
      id: 3,
      type: "Income",
      date: "2024-04-13",
      description: "Membership Fee",
      category: "Premium",
      amount: 99,
    },
  ];

  const staffPayments = [
    {
      id: 1,
      staff: "John Carter",
      type: "Salary",
      date: "2024-04-01",
      amount: 1200,
      status: "Paid",
    },
    {
      id: 2,
      staff: "Sophia Kim",
      type: "Commission",
      date: "2024-04-05",
      amount: 450,
      status: "Processing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiDollarSign className="text-green-500" /> Accounting & Billing
          </h1>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
            <FiPlus /> Create Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">$12,450</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiFileText className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">45</div>
                <div className="text-sm text-gray-500">Total Invoices</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">$2,340</div>
                <div className="text-sm text-gray-500">Staff Payments</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiDollarSign className="text-red-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">$1,230</div>
                <div className="text-sm text-gray-500">Total Expenses</div>
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
              <FiFileText className="inline mr-2" /> Invoices
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 1
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500"
              }`}
            >
              <FiDollarSign className="inline mr-2" /> Transactions
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 2
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500"
              }`}
            >
              <FiUsers className="inline mr-2" /> Staff Payments
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 3
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500"
              }`}
            >
              <FiTrendingUp className="inline mr-2" /> Reports
            </Tab>
          </TabList>

          {/* Invoices Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FiDownload className="inline" /> Export
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{invoice.id}</td>
                      <td className="px-6 py-4">{invoice.customer}</td>
                      <td className="px-6 py-4">{invoice.date}</td>
                      <td className="px-6 py-4">${invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-500">
                          <FiDownload />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-green-500">
                          <FiFileText />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Transactions Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Income & Expense Tracking
                </h2>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FiPlus /> Add Transaction
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            transaction.type === "Income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{transaction.date}</td>
                      <td className="px-6 py-4">{transaction.description}</td>
                      <td className="px-6 py-4">{transaction.category}</td>
                      <td
                        className={`px-6 py-4 font-medium ${
                          transaction.type === "Income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Staff Payments Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Staff Payments</h2>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FiPlus /> Add Payment
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{payment.staff}</td>
                      <td className="px-6 py-4">{payment.type}</td>
                      <td className="px-6 py-4">{payment.date}</td>
                      <td className="px-6 py-4">${payment.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Reports Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Financial Reports</h2>
                <div className="flex gap-3">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Daily Report
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Monthly Report
                  </button>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-gray-50 h-64 rounded-lg mb-6 flex items-center justify-center text-gray-400">
                Revenue Chart (Integrate Chart Library Here)
              </div>

              {/* Report Summary */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">
                    Top Revenue Sources
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Hair Services</span>
                      <span className="font-medium">$5,230</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Products</span>
                      <span className="font-medium">$1,450</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">Major Expenses</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Salaries</span>
                      <span className="font-medium">$3,200</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Products</span>
                      <span className="font-medium">$890</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
