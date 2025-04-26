"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiPlus,
  FiX,
  FiSave,
} from "react-icons/fi";

import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface StaffData {
  id: string;
  fullname: string;
  profile_img: string;
  branch: {
    id: string;
    branch_name: string;
    service: Service[];
  };
  appointments: Appointment[];
  user: {
    salonId: string;
  };
}

interface Appointment {
  id: string;
  client: {
    id: string;
    client_name: string;
  };
  service: {
    id: string;
    service_name: string;
    time: string;
    service_price: number;
  };
  time: string;
  status: string;
  date: string;
}

interface Service {
  id: string;
  service_name: string;
}

interface Client {
  id: string;
  client_name: string;
  email: string;
  contact: string;
  branch_id: string;
  staff_id?: string;
  createdAt: string;
}

interface DecodedToken {
  userId: string;
}

export default function ClientManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [client, setclient] = useState<Client[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [contact, setcontact] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [editing, setEditing] = useState<{
    clientId: string;
    field: string;
    value: string;
  } | null>(null);

  // Filters
  const [minAppointments, setMinAppointments] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");

  const getclients = async () => {
    const salonid = staffData?.user.salonId;
    try {
      const response = await axios.get(
        `https://salon-backend-3.onrender.com/api/clients/gettotalclient/${salonid}`
      );
      if (response.data.success) {
        setclient(response.data.clients);
      }
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.log(error);
    }
  };
  useEffect(() => {
    getclients();
  }, [staffData]);
  const fetchAllData = async () => {
    const staffToken = Cookies.get("staffToken");
    if (!staffToken) return;

    try {
      const decoded = jwtDecode<DecodedToken>(staffToken);

      // Fetch staff data
      const staffResponse = await axios.get(
        `https://salon-backend-3.onrender.com/api/staff/get/${decoded.userId}`
      );
      setStaffData(staffResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  // Fetch dummy data
  useEffect(() => {
    setTimeout(() => {
      setFilteredClients(client);
    }, 500);
  }, []);

  // Filter clients
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = client.filter((client) => {
        const matchesSearch = [
          client.client_name.toLowerCase(),
          client.email.toLowerCase(),
          client.contact.toLowerCase(),
        ].some((value) => value.includes(searchQuery.toLowerCase()));

        return matchesSearch;
      });

      setFilteredClients(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, client, minAppointments, registrationDate]);

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

  // Add handleSave function
  const handleSave = async () => {
    if (!editing) return;

    try {
      const clientToUpdate = client.find((c) => c.id === editing.clientId);
      if (!clientToUpdate) {
        toast.error("Client not found");
        return;
      }

      const updatedData = {
        client_name:
          editing.field === "client_name"
            ? editing.value
            : clientToUpdate.client_name,
        email: editing.field === "email" ? editing.value : clientToUpdate.email,
        contact:
          editing.field === "contact" ? editing.value : clientToUpdate.contact,
      };

      const response = await axios.put(
        `https://salon-backend-3.onrender.com/api/clients/updateclient/${editing.clientId}`,
        updatedData
      );

      if (response.data.success) {
        const updatedClients = client.map((c) => {
          if (c.id === editing.clientId) {
            return { ...c, ...updatedData };
          }
          return c;
        });
        setclient(updatedClients);
        toast.success("Client updated successfully");
        setEditing(null);
      } else {
        toast.error(response.data.message || "Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    }
  };

  const renderEditableField = (
    client: Client,
    field: "client_name" | "email" | "contact",
    value: string
  ) => {
    const isEditing =
      editing?.clientId === client.id && editing?.field === field;

    return (
      <div className="flex items-center gap-2 group">
        {isEditing ? (
          <input
            type={field === "email" ? "email" : "text"}
            value={editing.value}
            onChange={(e) => setEditing({ ...editing, value: e.target.value })}
            className="border-b-2 border-indigo-500 px-1 py-0.5 focus:outline-none"
            autoFocus
          />
        ) : (
          <>
            <span>{value}</span>
            <button
              onClick={() => setEditing({ clientId: client.id, field, value })}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 hover:text-indigo-700"
            >
              <FiEdit className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };

  // Add new client
  const handleAddClient = async () => {
    if (!name || !email || !contact) {
      alert("Please fill all required fields");
      return;
    }

    const response = await axios.post(
      "https://salon-backend-3.onrender.com/api/clients/addclients",
      {
        client_name: name,
        email: email,
        contact: contact,
        salon_id: staffData?.user.salonId,
      }
    );

    console.log(response);
    resetform();
    getclients();
  };

  const resetform = () => {
    setname("");
    setemail("");
    setcontact("");
    setIsAddingClient(false);
  };

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
                  {/* Decorative top border animation */}
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
                    {/* Client Name Field */}
                    <motion.div
                      variants={{
                        hidden: { y: 10, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      className="relative group"
                    >
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none peer bg-transparent"
                        placeholder=" "
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                      />
                      <label className="absolute left-4 top-3.5 px-1 transition-all transform -translate-y-5 scale-75 text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 bg-white group-hover:text-gray-600">
                        Client Name
                      </label>
                    </motion.div>

                    {/* Email Field */}
                    <motion.div
                      variants={{
                        hidden: { y: 10, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      className="relative group"
                    >
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none peer bg-transparent"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                      />
                      <label className="absolute left-4 top-3.5 px-1 transition-all transform -translate-y-5 scale-75 text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 bg-white group-hover:text-gray-600">
                        Email
                      </label>
                    </motion.div>

                    {/* Contact Field */}
                    <motion.div
                      variants={{
                        hidden: { y: 10, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      className="relative group"
                    >
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none peer bg-transparent"
                        placeholder=" "
                        value={contact}
                        onChange={(e) => setcontact(e.target.value)}
                      />
                      <label className="absolute left-4 top-3.5 px-1 transition-all transform -translate-y-5 scale-75 text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 bg-white group-hover:text-gray-600">
                        Contact
                      </label>
                    </motion.div>

                    {/* Status Dropdown */}
                    <motion.div
                      variants={{
                        hidden: { y: 10, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                    ></motion.div>
                  </motion.div>

                  {/* Form Buttons */}
                  <motion.div
                    className="mt-8 flex gap-3 justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={() => {
                        setIsAddingClient(false);
                        setname("");
                        setemail("");
                        setcontact("");
                      }}
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
              <p className="text-2xl font-bold">{client.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
              <FiUser className="text-xl" />
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

                {editing && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
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
                          {client.client_name.charAt(0)}
                        </div>
                        <div className="ml-4 space-y-2">
                          {renderEditableField(
                            client,
                            "client_name",
                            client.client_name
                          )}
                          {renderEditableField(client, "email", client.email)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEditableField(client, "contact", client.contact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {editing?.clientId === client.id ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={handleSave}
                              className="p-2 hover:bg-green-100 rounded-lg text-green-600 tooltip"
                              data-tip="Save Changes"
                            >
                              <FiSave className="text-lg" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => setEditing(null)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 tooltip"
                              data-tip="Cancel"
                            >
                              <FiX className="text-lg" />
                            </motion.button>
                          </>
                        ) : (
                          <></>
                        )}
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
