"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiEdit,
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiX,
  FiPercent,
  FiUser,
  FiAlertTriangle,
  FiPlus,
  FiActivity,
  FiCreditCard,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/Components/LoadingSpinner";

interface User {
  id: string;
  fullname: string;
  email: string;
  createdAt: string;
  PurchasedPlan: {
    name: string;
    price: number;
  }[];
}

interface Salesperson {
  id: string;
  name: string;
  email: string;
  contact: string;
  commission: number;
  referralCode: string;
  createdAt: string;
  users: User[];
  salaries: {
    amount: number;
    date: string;
  }[];
  totalUsers: number;
  totalRevenue: number;
  profileImage?: string;
}

interface CommissionData {
  commissionPercentage: number;
  totalSales: number;
  totalCommission: number;
  totalPaid: number;
  leftCommission: number;
  formatted: {
    totalCommission: string;
    totalPaid: string;
    leftCommission: string;
  };
}

interface salaries {
  amount: number;
  date: string;
}

export default function SalespersonProfile() {
  const pathname = usePathname();
  const salesId = pathname.split("/").pop();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null);
  const [commissionData, setCommissionData] = useState<CommissionData | null>(
    null
  );
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [newSalary, setNewSalary] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [salaryhistory, setsalaryhistory] = useState<salaries[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesRes, commissionRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/getsalesbyid/${salesId}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/commision/${salesId}`
          ),
        ]);

        if (!salesRes.ok || !commissionRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const salesData = await salesRes.json();
        const commissionData = await commissionRes.json();
        console.log(salesData, "Salesdata");
        console.log(commissionData, "commisiondata");
        setsalaryhistory(salesData.data.salaries);
        setSalesperson(salesData.data);
        setCommissionData(commissionData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (salesId) fetchData();
  }, [salesId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (salesperson) {
          setSalesperson({
            ...salesperson,
            profileImage: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalarySubmit = async () => {
    if (!newSalary || isNaN(Number(newSalary))) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/addsalry/${salesId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(newSalary) }),
        }
      );

      if (!response.ok) throw new Error("Salary addition failed");

      const [salesRes, commissionRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/getsalesbyid/${salesId}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/commision/${salesId}`
        ),
      ]);

      setSalesperson(await salesRes.json().then((res) => res.data));
      setCommissionData(await commissionRes.json().then((res) => res.data));

      setShowSuccess(true);
      setShowAddSalary(false);
      setTimeout(() => setShowSuccess(false), 3000);
      setNewSalary("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Salary addition failed");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !salesperson || !commissionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-4">
          <FiAlertTriangle className="w-12 h-12 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Data
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              {salesperson.profileImage ? (
                <img
                  src={salesperson.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-50"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-50 flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-blue-500" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-all"
              >
                <FiEdit className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {salesperson.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <p>{salesperson.email}</p>
                    <p>{salesperson.contact}</p>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      Referral Code: {salesperson.referralCode}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Joined: {formatDate(salesperson.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddSalary(true)}
                  className="hidden md:flex items-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Salary
                </button>
              </div>
              <button
                onClick={() => setShowAddSalary(true)}
                className="md:hidden mt-4 w-full bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <FiPlus className="w-5 h-5" />
                Add Salary
              </button>
            </div>
          </div>
        </motion.div>

        {/* Commission Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Total Users */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{salesperson.totalUsers}</p>
              </div>
            </div>
          </motion.div>

          {/* Commission Rate */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiPercent className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Commission Rate</p>
                <p className="text-2xl font-bold">{salesperson.commission}%</p>
              </div>
            </div>
          </motion.div>

          {/* Total Sales */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiActivity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">
                  ₹{commissionData.totalSales.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Commission */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiCreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Commission</p>
                <p className="text-2xl font-bold">
                  {commissionData.formatted.totalCommission}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Paid Commission */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiArrowUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid Commission</p>
                <p className="text-2xl font-bold text-green-600">
                  {commissionData.formatted.totalPaid}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Due Commission */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiArrowDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Commission</p>
                <p
                  className={`text-2xl font-bold ${
                    commissionData.leftCommission >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {commissionData.formatted.leftCommission}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Salary History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Salary History</h2>
            <FiDollarSign className="w-8 h-8 text-green-500" />
          </div>

          {salaryhistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
              <FiAlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No salary records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {salaryhistory.map((salary, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FiCreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {formatDate(salary.date)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Salary Disbursement
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{salary.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Managed Users Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Managed Users</h2>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2.5 w-full bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FiFilter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {salesperson.users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiUser className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No users found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {salesperson.users
                .filter((user) => {
                  const searchTerm = searchQuery.toLowerCase();
                  return (
                    user.fullname.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                  );
                })
                .map((user) => (
                  <div
                    key={user.id}
                    className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.fullname}
                        </h3>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Joined: {formatDate(user.createdAt)}
                        </p>
                        <p className="text-blue-600 font-medium">
                          ₹
                          {user.PurchasedPlan.reduce(
                            (sum, plan) => sum + plan.price,
                            0
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Add Salary Modal */}
        <AnimatePresence>
          {showAddSalary && (
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add New Salary
                  </h2>
                  <button
                    onClick={() => setShowAddSalary(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                      placeholder="Enter salary amount"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowAddSalary(false)}
                      className="w-full bg-gray-100 text-gray-700 py-3.5 px-6 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSalarySubmit}
                      className="w-full md:max-w-[200px] bg-blue-600 text-white py-2.5 px-4 rounded-md font-semibold text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">Add Salary</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <FiCheckCircle className="w-6 h-6" />
              Salary added successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
