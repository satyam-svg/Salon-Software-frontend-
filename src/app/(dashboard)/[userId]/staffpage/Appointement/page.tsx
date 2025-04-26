"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiScissors,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

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
}

interface DecodedToken {
  userId: string;
}

const StaffAppointmentsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    client_id: "",
    service_id: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const salonid = staffData?.user.salonId;
    const getclients = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/gettotalclient/${salonid}`
        );
        if (response.data.success) {
          setClients(response.data.clients);
        }
      } catch (error) {
        toast.error("Failed to fetch clients");
        console.log(error);
      }
    };
    if (salonid) getclients();
  }, [staffData]);

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
    if (hasMounted) {
      fetchAllData();
    }
  }, [hasMounted]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/update/${id}`,
        { status }
      );
      fetchAllData();
      toast.success(`Appointment ${status}`);
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      if (!newAppointment.client_id || !newAppointment.service_id) {
        toast.error("Please select client and service");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/create`,
        {
          salon_id: staffData?.user.salonId,
          branch_id: staffData?.branch.id,
          staff_id: staffData?.id,
          service_id: newAppointment.service_id,
          client_id: newAppointment.client_id,
          date: newAppointment.date,
          time: newAppointment.time,
          status: "pending",
        }
      );

      if (response.status === 201) {
        toast.success("Appointment created!");
        setShowModal(false);
        setNewAppointment({
          client_id: "",
          service_id: "",
          date: "",
          time: "",
        });
        fetchAllData();
      }
    } catch (error) {
      toast.error("Failed to create appointment");
      console.error(error);
    }
  };

  const pendingAppointments =
    staffData?.appointments.filter((a) => a.status === "pending") || [];
  const confirmedAppointments =
    staffData?.appointments.filter((a) => a.status === "confirmed") || [];

  const formatDate = (dateString: string) => {
    if (!hasMounted) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!hasMounted || loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all salon appointments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="text-xl" />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Appointments</p>
              <p className="text-2xl font-bold">{pendingAppointments.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <FiClock className="text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed Appointments</p>
              <p className="text-2xl font-bold">
                {confirmedAppointments.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiCheckCircle className="text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                $
                {staffData?.appointments
                  .reduce((sum, a) => sum + a.service.service_price, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiDollarSign className="text-2xl" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Pending Appointments
        </h2>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingAppointments.map((appointment) => (
                <motion.tr
                  key={appointment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {appointment.client.client_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiScissors className="text-gray-400" />
                      {appointment.service.service_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      {formatDate(appointment.date)} • {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "confirmed")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <FiCheckCircle className="text-lg" />
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "cancelled")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FiXCircle className="text-lg" />
                        Cancel
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {pendingAppointments.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pending appointments found
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Appointments
        </h2>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffData?.appointments.map((appointment) => (
                <motion.tr
                  key={appointment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {appointment.client.client_name}
                  </td>
                  <td className="px-6 py-4">
                    {appointment.service.service_name}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(appointment.date)} • {appointment.time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4">
                Schedule New Appointment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Select Client
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newAppointment.client_id}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        client_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Choose Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.client_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Select Service
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newAppointment.service_id}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        service_id: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Choose Service</option>
                    {staffData?.branch.service.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Select Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAppointment}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffAppointmentsPage;
