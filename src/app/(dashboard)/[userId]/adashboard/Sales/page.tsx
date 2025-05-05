"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiUsers,
  FiStar,
  FiTrash2,
  FiEdit,
  FiX,
} from "react-icons/fi";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function MarketingTeam() {
  const [activeTab, setActiveTab] = useState("sales");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalesperson, setNewSalesperson] = useState({
    name: "",
    email: "",
    commissionRate: 15,
    referralCode: "",
  });

  // Dummy data
  const [salesTeam, setSalesTeam] = useState([
    {
      id: 1,
      name: "John Carter",
      email: "john@example.com",
      commissionRate: 15,
      clients: 12,
      leads: 20,
      referralCode: "JOHN2024",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sophia Martinez",
      email: "sophia@example.com",
      commissionRate: 18,
      clients: 8,
      leads: 15,
      referralCode: "SOPHIA18",
      joinedDate: "2024-02-01",
    },
    {
      id: 3,
      name: "Ryan Kim",
      email: "ryan@example.com",
      commissionRate: 20,
      clients: 15,
      leads: 25,
      referralCode: "RYAN20K",
      joinedDate: "2024-03-10",
    },
  ]);

  const [referredClients] = useState([
    {
      id: 1,
      client: "Glamour Studio",
      referrer: "JOHN2024",
      date: "2024-04-15",
    },
    { id: 2, client: "Urban Cuts", referrer: "SOPHIA18", date: "2024-04-14" },
    { id: 3, client: "Luxe Beauty", referrer: "RYAN20K", date: "2024-04-13" },
  ]);

  const generateReferralCode = (name) => {
    return `${name.slice(0, 4).toUpperCase()}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  };

  const handleAddSalesperson = (e) => {
    e.preventDefault();
    const newMember = {
      id: salesTeam.length + 1,
      ...newSalesperson,
      referralCode: generateReferralCode(newSalesperson.name),
      clients: 0,
      leads: 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setSalesTeam([...salesTeam, newMember]);
    setShowAddForm(false);
    setNewSalesperson({
      name: "",
      email: "",
      commissionRate: 15,
      referralCode: "",
    });
  };

  const calculateCommission = (clients, rate) => {
    return clients * 1000 * (rate / 100);
  };

  const getConversionRate = (clients, leads) => {
    return leads === 0 ? 0 : ((clients / leads) * 100).toFixed(1);
  };

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

        {/* Tabs */}
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
                              {member.clients}
                            </div>
                            <div className="text-xs text-gray-500">Clients</div>
                          </div>
                          <div className="h-8 w-px bg-gray-200" />
                          <div className="text-center">
                            <div className="font-medium text-gray-700">
                              {member.leads}
                            </div>
                            <div className="text-xs text-gray-500">Leads</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-green-600">
                          ₹
                          {calculateCommission(
                            member.clients,
                            member.commissionRate
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.commissionRate}% Rate
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                              style={{
                                width: `${getConversionRate(
                                  member.clients,
                                  member.leads
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {getConversionRate(member.clients, member.leads)}%
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
                          <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                            <FiTrash2 className="w-5 h-5" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Referral Tracking
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Referral Code
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Salesperson
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {referredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {client.client}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {client.referrer}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {client.date}
                        </td>
                        <td className="px-6 py-4">
                          {salesTeam.find(
                            (sp) => sp.referralCode === client.referrer
                          )?.name || "Unknown"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Salesperson Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                variants={modalVariants}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      New Salesperson
                    </h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSalesperson} className="space-y-5">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                          value={newSalesperson.name}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              name: e.target.value,
                            })
                          }
                          placeholder=" "
                        />
                        <label
                          className="absolute left-4 top-3 px-1 text-gray-500 transition-all pointer-events-none
                          peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                          -top-2 text-sm bg-white"
                        >
                          Full Name
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                          value={newSalesperson.email}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              email: e.target.value,
                            })
                          }
                          placeholder=" "
                        />
                        <label
                          className="absolute left-4 top-3 px-1 text-gray-500 transition-all pointer-events-none
                          peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                          -top-2 text-sm bg-white"
                        >
                          Email Address
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          required
                          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                          value={newSalesperson.commissionRate}
                          onChange={(e) =>
                            setNewSalesperson({
                              ...newSalesperson,
                              commissionRate: e.target.value,
                            })
                          }
                          placeholder=" "
                        />
                        <label
                          className="absolute left-4 top-3 px-1 text-gray-500 transition-all pointer-events-none
                          peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                          -top-2 text-sm bg-white"
                        >
                          Commission Rate (%)
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 rounded-xl
                               hover:from-blue-600 hover:to-purple-600 transition-all font-semibold
                               flex items-center justify-center gap-2 shadow-md hover:shadow-sm"
                    >
                      <FiUserPlus className="w-5 h-5" />
                      Create Salesperson
                    </button>
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
