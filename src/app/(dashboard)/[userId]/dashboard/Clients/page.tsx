"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiTrash,
  FiUserCheck,
  FiPlus,
} from "react-icons/fi";

interface Appointment {
  id: string;
  date: string;
  service: string;
  price: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  contact: string;
  registrationDate: string;
  appointments: Appointment[];
  status: "active" | "inactive";
  totalSpent: number;
}

const dummyClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    contact: "+1 555-1234",
    registrationDate: "2023-01-15",
    appointments: [
      { id: "a1", date: "2024-03-15", service: "Hair Color", price: 150 },
      { id: "a2", date: "2024-04-02", service: "Haircut", price: 75 },
    ],
    status: "active",
    totalSpent: 225,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    contact: "+1 555-5678",
    registrationDate: "2023-03-22",
    appointments: [
      { id: "a3", date: "2024-02-10", service: "Beard Trim", price: 40 },
    ],
    status: "active",
    totalSpent: 40,
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@example.com",
    contact: "+1 555-8765",
    registrationDate: "2024-01-10",
    appointments: [],
    status: "inactive",
    totalSpent: 0,
  },
];

export default function ClientManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    status: "active",
  });
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filters
  const [minAppointments, setMinAppointments] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");

  // Fetch dummy data
  useEffect(() => {
    setTimeout(() => {
      setClients(dummyClients);
      setFilteredClients(dummyClients);
    }, 500);
  }, []);

  // Filter clients
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = clients.filter((client) => {
        const matchesSearch = [
          client.name.toLowerCase(),
          client.email.toLowerCase(),
          client.contact.toLowerCase(),
          client.totalSpent.toString(),
          client.appointments.length.toString(),
        ].some((value) => value.includes(searchQuery.toLowerCase()));

        const matchesAdvanced = [
          registrationDate ? client.registrationDate >= registrationDate : true,
          minAppointments
            ? client.appointments.length >= parseInt(minAppointments)
            : true,
        ].every(Boolean);

        return matchesSearch && matchesAdvanced;
      });

      setFilteredClients(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, clients, minAppointments, registrationDate]);

  // Scroll progress
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const handleScroll = () => {
      const scrollTop = table.scrollTop;
      const scrollHeight = table.scrollHeight - table.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    table.addEventListener("scroll", handleScroll);
    return () => table.removeEventListener("scroll", handleScroll);
  }, []);

  // Status colors
  const statusColors = {
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-rose-100 text-rose-800",
  };

  // Add new client
  const handleAddClient = () => {
    if (
      !newClient.name ||
      !newClient.email ||
      !newClient.contact ||
      !newClient.status
    ) {
      alert("Please fill all required fields");
      return;
    }

    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClient.name,
      email: newClient.email,
      contact: newClient.contact,
      registrationDate: new Date().toISOString().split("T")[0],
      appointments: [],
      status: newClient.status,
      totalSpent: 0,
    };

    setClients([...clients, client]);
    setIsAddingClient(false);
    setNewClient({ status: "active" });
  };

  type InputCompatibleValue = string | number | Appointment[] | undefined;
  function getInputValue(
    value: InputCompatibleValue
  ): string | number | undefined {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return undefined;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddingClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-lg z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-center min-h-screen"
              >
                <motion.div
                  className="bg-white p-6 rounded-2xl w-full max-w-md mx-4 shadow-2xl relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  }}
                >
                  {/* Decorative elements */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                  />

                  <h2 className="text-3xl font-bold mb-6 text-gray-800 mt-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block"
                    >
                      Add New Client
                    </motion.span>
                  </h2>

                  <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                  >
                    {["name", "email", "contact"].map((field, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { y: 10, opacity: 0 },
                          visible: { y: 0, opacity: 1 },
                        }}
                        className="relative group"
                      >
                        <input
                          type={
                            field === "email"
                              ? "email"
                              : field === "contact"
                              ? "tel"
                              : "text"
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none peer bg-transparent"
                          placeholder=" "
                          value={getInputValue(
                            newClient[field as keyof Client]
                          )}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              [field as keyof Client]: e.target.value,
                            })
                          }
                        />

                        <label className="absolute left-4 top-3.5 px-1 transition-all transform -translate-y-5 scale-75 text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 bg-white group-hover:text-gray-600">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                      </motion.div>
                    ))}

                    <motion.div
                      variants={{
                        hidden: { y: 10, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                    >
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none bg-white"
                          value={newClient.status}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              status: e.target.value as Client["status"],
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <div className="absolute right-4 top-4 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-8 flex gap-3 justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={() => setIsAddingClient(false)}
                      className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-95 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddClient}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 font-medium relative overflow-hidden"
                    >
                      <span className="relative z-10">Add Client</span>
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and analyze client information
          </p>
        </div>

        <div className="flex gap-4">
          {/* Add Client Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingClient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors group relative"
          >
            <FiPlus className="text-lg" />
            <span>Add Client</span>

            {/* Animated Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-28">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <span>Add New Client</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          </motion.button>

          {/* Search Bar */}
          <motion.div
            layout
            className={`relative ${
              isExpanded ? "w-full md:w-96" : "w-full md:w-80"
            }`}
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isExpanded
                    ? "Search clients by name, email, or contact..."
                    : "Search clients..."
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            {/* Advanced Search */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        value={registrationDate}
                        onChange={(e) => setRegistrationDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Appointments
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        placeholder="Minimum appointments"
                        value={minAppointments}
                        onChange={(e) => setMinAppointments(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold">{filteredClients.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
              <FiUser className="text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Clients</p>
              <p className="text-2xl font-bold">
                {filteredClients.filter((c) => c.status === "active").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
              <FiUserCheck className="text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Appointments</p>
              <p className="text-2xl font-bold">
                {filteredClients.length > 0
                  ? (
                      filteredClients.reduce(
                        (sum, c) => sum + c.appointments.length,
                        0
                      ) / filteredClients.length
                    ).toFixed(1)
                  : 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <FiCalendar className="text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                $
                {filteredClients
                  .reduce((sum, c) => sum + c.totalSpent, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Client Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Scroll Progress */}
        <div className="absolute right-0 top-0 h-full w-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-indigo-500 rounded-full"
            animate={{ height: `${scrollProgress}%` }}
            transition={{ type: "spring", damping: 20 }}
          />
        </div>

        {/* Table Container */}
        <div
          ref={tableRef}
          className="overflow-y-auto max-h-[600px] pr-4 scrollbar-hide"
        >
          <table className="w-full relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 backdrop-blur-sm">
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredClients.map((client) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-indigo-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(client.registrationDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.appointments.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-indigo-600">
                        ${client.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[client.status]
                        }`}
                      >
                        {client.status.charAt(0).toUpperCase() +
                          client.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {/* Edit Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 relative"
                        >
                          <FiEdit className="text-sm" />

                          {/* Edit Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                              <FiEdit className="text-xs" />
                              <span>Update Client</span>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                            </div>
                          </div>
                        </motion.button>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 relative"
                        >
                          <FiTrash className="text-sm" />

                          {/* Delete Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                              <FiTrash className="text-xs" />
                              <span>Delete Client</span>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No clients found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
