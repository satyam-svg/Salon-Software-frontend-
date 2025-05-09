"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiUsers,
  FiStar,
  FiTrash2,
  FiEdit,
  FiX,
  FiLoader,
  FiSettings,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

interface User {
  id: string;
  // Add more user fields as needed
  // name?: string;
  // email?: string;
  // etc.
}

interface SalesmanSalary {
  id: string;
  amount: number;
  // Add more salary fields if necessary
}

interface SalesPerson {
  id: string;
  name: string;
  email: string;
  contact: string;
  commission: number;
  referralCode?: string;
  createdAt: string;
  users: User[];
  salaries: SalesmanSalary[];
}

export default function MarketingTeam() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sales");
  const [showAddForm, setShowAddForm] = useState(false);
  const [salesTeam, setSalesTeam] = useState<SalesPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSalesperson, setNewSalesperson] = useState({
    name: "",
    email: "",
    contact: "",
    commission: 15,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSalesTeam = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/getsalesperson`
        );
        // console.log(response.data.data);
        setSalesTeam(response.data.data);
        console.log(salesTeam);
      } catch (err) {
        setError("Failed to fetch sales team data");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesTeam();
  }, []);

  useEffect(() => {
    if (salesTeam.length > 0) {
      console.log("Fetched Sales Team:", salesTeam);
    }
  }, [salesTeam]);

  const handleAddSalesperson = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales/addsales`,
        newSalesperson
      );
      setSalesTeam([...salesTeam, response.data.data]);
      console.log(salesTeam);
      setShowAddForm(false);
      setNewSalesperson({
        name: "",
        email: "",
        contact: "",
        commission: 15,
      });
    } catch (err) {
      setError("Failed to add salesperson");
    } finally {
      setFormSubmitting(false);
    }
  };

  const calculateCommission = (salesPerson: SalesPerson) => {
    return (salesPerson.users || []).reduce((total, user) => {
      const userTotal = user.PurchasedPlan?.reduce(
        (sum, plan) => sum + plan.package.price,
        0
      );
      return total + (userTotal * salesPerson.commission) / 100;
    }, 0);
  };

  const getConversionRate = (clients: number, leads: number) => {
    return leads === 0 ? 0 : ((clients / leads) * 100).toFixed(1);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Marketing Team Dashboard
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-md flex items-center gap-2"
          >
            <FiUserPlus className="w-5 h-5" />
            <span>Add Salesperson</span>
          </button>
        </div>

        {salesTeam.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl"
          >
            <div className="text-gray-500 mb-4">No salespeople found</div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Add First Salesperson
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
                  activeTab === "sales"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <FiUsers className="inline mr-2" /> Sales Team
              </button>
              <button
                onClick={() => setActiveTab("referrals")}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
                  activeTab === "referrals"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <FiStar className="inline mr-2" /> Referrals
              </button>
            </div>

            {activeTab === "sales" ? (
              <motion.div
                key="sales-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">
                          Salesperson
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">
                          Performance
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">
                          Commission
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">
                          Conversion
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">
                          Referral Code
                        </th>
                        <th className="px-6 py-4 text-left font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {salesTeam.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex gap-4 items-center">
                              <div className="text-center">
                                <div className="font-medium text-blue-600">
                                  {member.users?.length ?? 0}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Clients
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-medium text-green-600">
                              ₹{calculateCommission(member).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.commission}% Rate
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
                                  style={{
                                    width: `${getConversionRate(
                                      member.users?.length ?? 0,
                                      member.users?.length ?? 0
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {getConversionRate(
                                  member.users?.length ?? 0,
                                  member.users?.length ?? 0
                                )}
                                %
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {member.referralCode}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  router.push(`Sales/${member.id}`)
                                }
                                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                              >
                                <FiSettings className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="referrals-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    Referral Tracking
                  </h2>
                  <div className="text-center text-gray-500">
                    Referral tracking coming soon
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[90vh] flex flex-col"
                variants={modalVariants}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Add New Salesperson
                    </h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  <form
                    onSubmit={handleAddSalesperson}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                      {/* Full Name Field */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          value={newSalesperson.name}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          value={newSalesperson.email}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Contact Field */}
                      <div>
                        <label
                          htmlFor="contact"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="contact"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          value={newSalesperson.contact}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              contact: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Commission Field */}
                      <div>
                        <label
                          htmlFor="commission"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          id="commission"
                          min="1"
                          max="50"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          value={newSalesperson.commission}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              commission: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4 pb-2 bg-white">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {formSubmitting ? (
                          <>
                            <FiLoader className="animate-spin w-5 h-5" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FiUserPlus className="w-5 h-5" />
                            Create Salesperson
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
