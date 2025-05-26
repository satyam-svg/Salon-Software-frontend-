"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiEdit,
  FiPlus,
  FiX,
  FiSave,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import { AnimatedButton } from "@/Components/ui/Button";

interface Appointment {
  id: string;
  date: string;
  service: Service;
  status: string;
}

interface Service {
  service_price: number;
}

interface clientresponse {
  id: string;
  client_name: string;
  email: string;
  contact: string;
  createdAt: string;
  appointments: Appointment[];
}

const SALON_THEME = {
  primary: "#b76e79",
  secondary: "#e8c4c0",
  accent: "#7a5a57",
  background: "#fff0ee",
  textPrimary: "#7a5a57",
  textSecondary: "#9e6d70",
};

export default function ClientManagementPage() {
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredClients, setFilteredClients] = useState<clientresponse[]>([]);

  const [client, setclient] = useState<clientresponse[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [salonid, setsalonid] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [contact, setcontact] = useState("");
  const pathname = usePathname();
  const userid = pathname.split("/")[1];
  const [clientcount, settotalcount] = useState(0);
  const [avgappointments, setavgappointments] = useState(0.0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revenue, setrevenue] = useState(0);
  const [avgrevenue, setavgrevenue] = useState(0.0);
  const [editing, setEditing] = useState<{
    clientId: string;
    field: string;
    value: string;
  } | null>(null);

  // Filters
  const [minAppointments] = useState("");
  const [registrationDate] = useState("");
  const [isSubmiitingClient, setIsSubmittingClient] = useState(false);

  // Fetch dummy data
  useEffect(() => {
    setTimeout(() => {
      setFilteredClients(client);
    }, 500);
  }, []);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setScreenLoaderToggle(true);
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        console.log(userData);

        if (!userData.user?.salonId) throw new Error("Salon not found");
        setsalonid(userData.user.salonId);
        console.log(salonid);
      } catch (err) {
        console.log(err);
      } finally {
        setScreenLoaderToggle(false);
      }
    };
    fetchBranches();
  }, [userid]);

  // Filter clients
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = client.filter((client) => {
        const matchesSearch = [
          client.client_name.toLowerCase(),
          client.email.toLowerCase(),
          client.contact.toLowerCase(),
          client.appointments.length.toString(),
        ].some((value) => value.includes(searchQuery.toLowerCase()));

        const matchesAdvanced = [
          registrationDate ? client.createdAt >= registrationDate : true,
          minAppointments
            ? client.appointments.length >= parseInt(minAppointments)
            : true,
        ].every(Boolean);

        return matchesSearch && matchesAdvanced;
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/updateclient/${editing.clientId}`,
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
  const getclients = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/gettotalclient/${salonid}`
    );
    if (!response.data.success) {
      toast.error(response.data.message);
    } else {
      settotalcount(response.data.total);
      setclient(response.data.clients);
    }
  };

  const renderEditableField = (
    client: clientresponse,
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
            className="border-b-2 border-[#b76e79] px-1 py-0.5 focus:outline-none text-[#7a5a57]"
            autoFocus
          />
        ) : (
          <>
            <span className="text-[#7a5a57]">{value}</span>
            <button
              onClick={() => setEditing({ clientId: client.id, field, value })}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#b76e79] hover:text-[#9e6d70]"
            >
              <FiEdit className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    getclients();
  }, [salonid]);

  useEffect(() => {
    console.log(client);

    if (client && client.length > 0) {
      let totalConfirmedAppointments = 0;
      let totalRevenue = 0;

      client.forEach((c) => {
        // Filter confirmed appointments first
        const confirmedAppointments =
          c.appointments?.filter((a) => a.status === "confirmed") || [];

        // Count confirmed appointments
        totalConfirmedAppointments += confirmedAppointments.length;

        // Sum revenue only for confirmed appointments
        confirmedAppointments.forEach((a) => {
          totalRevenue += a.service?.service_price || 0; // Safely handle missing service/price
        });
      });

      const totalClients = client.length;

      setrevenue(totalRevenue);
      setavgappointments(totalConfirmedAppointments / totalClients);
      setavgrevenue(totalRevenue / totalClients);
    } else {
      setavgappointments(0);
    }
  }, [client]);

  // Add new client
  const handleAddClient = async () => {
    if (!name || !email || !contact) {
      toast.error("Please fill all required field");
      return;
    }

    try {
      setIsSubmittingClient(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/addclients`,
        {
          client_name: name,
          email: email,
          contact: contact,
          salon_id: salonid,
        }
      );

      console.log(response);
      toast.success("Client added successfully!");

      resetform();
      getclients();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add client");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const resetform = () => {
    setname("");
    setemail("");
    setcontact("");
    setIsAddingClient(false);
  };

  const getclientrevenue = (client: clientresponse) => {
    let price = 0;
    client.appointments.forEach((a) => {
      price += a.service.service_price;
    });
    return price;
  };

  if (ScreenLoaderToggle) {
    return <Screenloader />;
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
                    <AnimatedButton
                      onClick={handleAddClient}
                      disabled={isSubmiitingClient}
                      variant="solid"
                      className={` py-2.5 px-6 rounded-xl shadow-lg text-base font-medium  w-40 ${
                        isSubmiitingClient
                          ? "opacity-75 cursor-not-allowed bg-[#b76e79]"
                          : "hover:shadow-[#e8c4c0] bg-[#b76e79] hover:bg-[#c9838d]"
                      } transition-all duration-200`}
                      icon={
                        isSubmiitingClient ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : null
                      }
                      iconPosition="left"
                      hoverScale={1.02}
                      tapScale={0.95}
                    >
                      {isSubmiitingClient ? "Adding..." : "Add Client"}
                    </AnimatedButton>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#7a5a57] font-dancing">
            Client Management
          </h1>
          <p className="text-[#9e6d70] mt-1">
            Manage and analyze client information
          </p>
        </div>

        <div className="flex gap-4">
          {/* Add Client Button */}
          <AnimatedButton
            onClick={() => setIsAddingClient(true)}
            variant="solid"
            gradient={[SALON_THEME.primary, SALON_THEME.secondary]}
            className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-[#e8c4c0] font-semibold text-base w-40"
            icon={<FiPlus className="text-lg text-white" />}
            iconPosition="left"
          >
            Add Client
          </AnimatedButton>

          {/* Search Bar */}
          <motion.div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9e6d70]" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e8c4c0] focus:outline-none focus:ring-2 focus:ring-[#b76e79] text-[#7a5a57]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: <FiUser />,
            title: "Total Clients",
            value: clientcount,
            color: SALON_THEME.primary,
          },
          {
            icon: <FiCalendar />,
            title: "Avg Appointments",
            value: avgappointments.toFixed(2),
            color: "#d8a5a5",
          },
          {
            icon: <FiDollarSign />,
            title: "Total Revenue",
            value: revenue,
            color: "#9e6d70",
          },
          {
            icon: <FiDollarSign />,
            title: "Average Revenue",
            value: avgrevenue.toFixed(2),
            color: SALON_THEME.secondary,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-[#e8c4c0]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9e6d70]">{stat.title}</p>
                <p className="text-2xl font-bold text-[#7a5a57]">
                  {stat.value}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: stat.color }}
              >
                {React.cloneElement(stat.icon, {
                  className: "text-xl text-white",
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Client Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Scroll Progress */}
        <div className="absolute right-0 top-0 h-full w-2 bg-[#e8c4c0] rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-[#b76e79] rounded-full"
            animate={{ height: `${scrollProgress}%` }}
          />
        </div>

        {/* Table Container */}
        <div
          ref={tableRef}
          className="overflow-y-auto max-h-[600px] pr-4 scrollbar-hide"
        >
          <table className="w-full relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-[#fff0ee] to-[#e8c4c0]">
                {[
                  "Client",
                  "Contact",
                  "Registered",
                  "Appointments",
                  "Total Spent",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-xs font-medium text-[#7a5a57] uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e8c4c0]">
              {filteredClients.map((client) => (
                <motion.tr
                  key={client.id}
                  className="hover:bg-[#fff0ee] transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#e8c4c0] flex items-center justify-center text-[#7a5a57]">
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
                  <td className="px-6 py-4 whitespace-nowrap text-[#7a5a57]">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#7a5a57]">
                    {client.appointments.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#b76e79] font-bold">
                    ₹{getclientrevenue(client).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {editing?.clientId === client.id && (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-[#7a5a57] hover:text-[#b76e79]"
                          >
                            <FiSave className="text-lg" />
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="text-[#7a5a57] hover:text-[#b76e79]"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <div className="text-[#e8c4c0] mb-4">
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
              <h3 className="text-lg font-medium text-[#7a5a57]">
                No clients found
              </h3>
              <p className="text-[#9e6d70] mt-1">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
