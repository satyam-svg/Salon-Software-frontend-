"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUser,
  FiTrendingUp,
  FiWatch,
} from "react-icons/fi";

interface StaffData {
  id: string;
  fullname: string;
  profile_img: string;
  salaries: Salaries[];
  attendances: Attendances[];
}

interface Salaries {
  amount: number;
  date: string;
}

interface Attendances {
  date: string;
  login_time: string;
}

interface DecodedToken {
  userId: string;
}

export default function StatsPage() {
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const fetchAllData = async () => {
    const staffToken = Cookies.get("staffToken");
    if (!staffToken) return;

    try {
      const decoded = jwtDecode<DecodedToken>(staffToken);
      const staffResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/staff/get/${decoded.userId}`
      );
      setStaffData(staffResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    if (hasMounted) {
      fetchAllData();
    }
  }, [hasMounted]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-20 bg-white rounded-xl shadow-sm"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="p-3 bg-indigo-100 rounded-lg">
            <FiUser className="text-2xl text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {staffData?.fullname}
            </h1>
            <p className="text-gray-600">Work History & Earnings</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Attendance History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiClock className="text-xl text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Attendance History</h2>
            </div>

            {staffData?.attendances.length ? (
              <div className="space-y-4">
                {staffData.attendances.map((attendance, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-gray-400" />
                      <span className="font-medium">
                        {new Date(attendance.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiWatch className="text-gray-400" />
                      <span>{attendance.login_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No attendance records found
              </div>
            )}
          </motion.div>

          {/* Salary History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="text-xl text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Salary History</h2>
            </div>

            {staffData?.salaries.length ? (
              <div className="space-y-4">
                {staffData.salaries.map((salary, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FiTrendingUp className="text-gray-400" />
                      <span className="font-medium">
                        {new Date(salary.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">
                      ₹{salary.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No salary records found
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="bg-indigo-100 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <FiClock className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attendance</p>
              <p className="text-2xl font-bold">
                {staffData?.attendances.length || 0}
              </p>
            </div>
          </div>

          <div className="bg-green-100 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <FiDollarSign className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold">
                ₹
                {staffData?.salaries
                  .reduce((sum, s) => sum + s.amount, 0)
                  .toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
