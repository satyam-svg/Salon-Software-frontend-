"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiDollarSign, FiClock, FiInfo, FiX } from "react-icons/fi";
import { format } from "date-fns";

interface Salesman {
  id: string;
  name: string;
  email: string;
  contact: string;
  commission: number;
  createdAt: Date;
  users: User[];
  salaries: SalesmanSalary[];
}

interface User {
  id: string;
  fullname: string;
  email: string;
  PurchasedPlan: PurchasedPlan[];
}

interface PurchasedPlan {
  id: string;
  date: Date;
  package: SubscriptionPackage;
}

interface SubscriptionPackage {
  name: string;
  price: number;
}

interface SalesmanSalary {
  id: string;
  amount: number;
  date: Date;
}

export default function SalesmanDashboard({ params }: { params: { id: string } }) {
  const [salesman, setSalesman] = useState<Salesman | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/salesman/${params.id}`);
        setSalesman(response.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !salesman) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
        {error || "Salesman not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6">
              <FiUser className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{salesman.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <FiInfo className="w-5 h-5" />
                  <span>{salesman.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5" />
                  <span>{salesman.commission}% Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  <span>Joined {format(new Date(salesman.createdAt), 'MMM yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Associated Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Plans Purchased</th>
                  <th className="px-6 py-4 text-left">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesman.users.map((user) => (
                  <tr 
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4">{user.fullname}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.PurchasedPlan.length}</td>
                    <td className="px-6 py-4">
                      ₹{user.PurchasedPlan.reduce((sum, plan) => sum + plan.package.price, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary History */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Salary History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesman.salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td className="px-6 py-4">{format(new Date(salary.date), 'dd MMM yyyy')}</td>
                    <td className="px-6 py-4">₹{salary.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Plan Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">{selectedUser.fullname}'s Purchased Plans</h3>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {selectedUser.PurchasedPlan.map((plan) => (
                    <div key={plan.id} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{plan.package.name}</h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(plan.date), 'dd MMM yyyy')}
                          </p>
                        </div>
                        <span className="text-lg font-semibold">
                          ₹{plan.package.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}