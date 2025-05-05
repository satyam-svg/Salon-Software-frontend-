"use client";
import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiUser,
  FiUsers,
} from "react-icons/fi";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("salons");

  // Dummy data
  const salons = [
    {
      id: 1,
      name: "Glamour Studio",
      owner: "Emma Wilson",
      plan: "Premium",
      status: "Active",
      registered: "2024-03-15",
    },
    {
      id: 2,
      name: "Urban Cuts",
      owner: "Mike Johnson",
      plan: "Basic",
      status: "Inactive",
      registered: "2024-02-28",
    },
    {
      id: 3,
      name: "Luxe Beauty",
      owner: "Sarah Miller",
      plan: "Pro",
      status: "Active",
      registered: "2024-04-01",
    },
    {
      id: 4,
      name: "Style Haven",
      owner: "David Brown",
      plan: "Premium",
      status: "Active",
      registered: "2024-03-22",
    },
    {
      id: 5,
      name: "Chic Looks",
      owner: "Linda Davis",
      plan: "Basic",
      status: "Inactive",
      registered: "2024-01-15",
    },
  ];

  const salesTeam = [
    { id: 1, name: "John Carter", salonsRegistered: 12, commission: 4500 },
    { id: 2, name: "Sophia Martinez", salonsRegistered: 8, commission: 3200 },
    { id: 3, name: "Ryan Kim", salonsRegistered: 15, commission: 6100 },
  ];

  const transactions = [
    {
      id: 1,
      date: "2024-04-15",
      salon: "Glamour Studio",
      plan: "Premium",
      amount: 299,
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-04-14",
      salon: "Urban Cuts",
      plan: "Basic",
      amount: 99,
      status: "Pending",
    },
    {
      id: 3,
      date: "2024-04-13",
      salon: "Luxe Beauty",
      plan: "Pro",
      amount: 199,
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mb-15">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Salon Management Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("salons")}
            className={`pb-2 px-4 ${
              activeTab === "salons"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            <FiUsers className="inline mr-2" /> Managed Salons ({salons.length})
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`pb-2 px-4 ${
              activeTab === "sales"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            <FiUser className="inline mr-2" /> Sales Team ({salesTeam.length})
          </button>
        </div>

        {activeTab === "salons" ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search salons..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg">
                  <FiFilter /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Salon Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Plan
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
                  {salons.map((salon) => (
                    <tr key={salon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{salon.name}</td>
                      <td className="px-6 py-4">{salon.owner}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                          {salon.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            salon.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {salon.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500">
                          <FiTrash2 />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-500">
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Team Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">
                Sales Team Performance
              </h2>
              <div className="space-y-6">
                {salesTeam.map((member) => (
                  <div
                    key={member.id}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">
                          {member.salonsRegistered} Salons Registered
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          ${member.commission}
                        </p>
                        <p className="text-sm text-gray-500">Commission</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">
                Recent Transactions
              </h2>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.salon}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${transaction.amount}</p>
                      <span
                        className={`text-sm ${
                          transaction.status === "Completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-500 text-white rounded-xl p-6">
            <FiUsers className="text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Total Salons</h3>
            <p className="text-3xl font-bold">45</p>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-6">
            <FiDollarSign className="text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Total Commission</h3>
            <p className="text-3xl font-bold">$12,450</p>
          </div>
          <div className="bg-purple-500 text-white rounded-xl p-6">
            <FiUser className="text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Active Sales Members</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}
