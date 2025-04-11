"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiUser,
  FiScissors,
  FiDollarSign,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import AppointmentManagementForm from "@/Components/dashboard/AppointmentManagementForm";

// Types (same as before)
interface User {
  fullname: string;
  email: string;
  profile_img: string;
}

interface Staff {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  user: User;
}

interface Service {
  id: string;
  service_name: string;
  service_price: number;
  time: number;
}

interface Client {
  id: string;
  client_name: string;
  email: string;
  contact: string;
}

interface Branch {
  id: string;
  branch_name: string;
  branch_location: string;
  contact_number: string;
}

interface Salon {
  id: string;
  salon_name: string;
  salon_tag: string;
  contact_email: string;
  contact_number: string;
}

interface Appointment {
  id: string;
  salon_id: string;
  branch_id: string;
  staff_id: string;
  service_id: string;
  client_id: string;
  date: string;
  time: string;
  status: string;
  salon: Salon;
  branch: Branch;
  staff: Staff;
  service: Service;
  client: Client;
}

// Sample Data (same as before)
const initialAppointments: Appointment[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    salon_id: "3e1b5a5a-7a5d-4b3d-8c1a-1a1a1a1a1a1a",
    branch_id: "4f2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    staff_id: "7d8e9f0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
    service_id: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    client_id: "6c5d4e3f-2a1b-0c9d-8e7f-6a5b4c3d2e1f",
    date: "2024-03-20",
    time: "14:30",
    status: "confirmed",
    salon: {
      id: "3e1b5a5a-7a5d-4b3d-8c1a-1a1a1a1a1a1a",
      salon_name: "Luxe Hair Studio",
      salon_tag: "Premium Hair Services",
      contact_email: "info@luxehair.com",
      contact_number: "+1 555-1234",
    },
    branch: {
      id: "4f2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      branch_name: "Downtown Branch",
      branch_location: "123 Main Street, City Center",
      contact_number: "+1 555-5678",
    },
    staff: {
      id: "7d8e9f0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
      fullname: "Sarah Johnson",
      email: "sarah@luxehair.com",
      contact: "+1 555-8765",
      user: {
        fullname: "Sarah Johnson",
        email: "sarah@luxehair.com",
        profile_img: "https://example.com/sarah.jpg",
      },
    },
    service: {
      id: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
      service_name: "Premium Haircut",
      service_price: 75,
      time: 60,
    },
    client: {
      id: "6c5d4e3f-2a1b-0c9d-8e7f-6a5b4c3d2e1f",
      client_name: "John Doe",
      email: "john.doe@example.com",
      contact: "+1 555-4321",
    },
  },
  {
    id: "670e8501-e29c-42d5-b717-556755550001",
    salon_id: "3e1b5a5a-7a5d-4b3d-8c1a-1a1a1a1a1a1a",
    branch_id: "4f2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    staff_id: "8e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b",
    service_id: "a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    client_id: "7d6e5f4a-3b2c-1d0e-9f8a-7b6c5d4e3f2a",
    date: "2024-03-20",
    time: "16:00",
    status: "pending",
    salon: {
      id: "3e1b5a5a-7a5d-4b3d-8c1a-1a1a1a1a1a1a",
      salon_name: "Luxe Hair Studio",
      salon_tag: "Premium Hair Services",
      contact_email: "info@luxehair.com",
      contact_number: "+1 555-1234",
    },
    branch: {
      id: "4f2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      branch_name: "Downtown Branch",
      branch_location: "123 Main Street, City Center",
      contact_number: "+1 555-5678",
    },
    staff: {
      id: "8e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b",
      fullname: "Michael Chen",
      email: "michael@luxehair.com",
      contact: "+1 555-1122",
      user: {
        fullname: "Michael Chen",
        email: "michael@luxehair.com",
        profile_img: "https://example.com/michael.jpg",
      },
    },
    service: {
      id: "a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
      service_name: "Hair Coloring",
      service_price: 150,
      time: 120,
    },
    client: {
      id: "7d6e5f4a-3b2c-1d0e-9f8a-7b6c5d4e3f2a",
      client_name: "Emma Wilson",
      email: "emma.w@example.com",
      contact: "+1 555-3344",
    },
  },
  {
    id: "790e8602-e29d-43d6-c718-666866660002",
    salon_id: "3e1b5a5a-7a5d-4b3d-8c1a-1a1a1a1a1a1a",
    branch_id: "5g3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
    staff_id: "9f0a1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c",
    service_id: "b9c8d7e6-5f4e-3a2b-1c0d-9e8f7a6b5c4d",
    client_id: "8e7f6a5b-4c3d-2e1f-0a9b-8c7d6e5f4a3b",
    date: "2024-03-21",
    time: "11:00",
    status: "completed",
    salon: {
      id: "3e1b5a5a-7a5d-4b3d-8c1a-1a1a1a1a1a1a",
      salon_name: "Luxe Hair Studio",
      salon_tag: "Premium Hair Services",
      contact_email: "info@luxehair.com",
      contact_number: "+1 555-1234",
    },
    branch: {
      id: "5g3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
      branch_name: "Westside Branch",
      branch_location: "456 Oak Avenue, West District",
      contact_number: "+1 555-9999",
    },
    staff: {
      id: "9f0a1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c",
      fullname: "David Martinez",
      email: "david@luxehair.com",
      contact: "+1 555-7788",
      user: {
        fullname: "David Martinez",
        email: "david@luxehair.com",
        profile_img: "https://example.com/david.jpg",
      },
    },
    service: {
      id: "b9c8d7e6-5f4e-3a2b-1c0d-9e8f7a6b5c4d",
      service_name: "Beard Trim & Style",
      service_price: 40,
      time: 30,
    },
    client: {
      id: "8e7f6a5b-4c3d-2e1f-0a9b-8c7d6e5f4a3b",
      client_name: "James Smith",
      email: "james.s@example.com",
      contact: "+1 555-5566",
    },
  },
];

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZg.ttf",
      fontWeight: 600,
    },
  ],
});

const InvoiceDocument = ({ appointment }: { appointment: Appointment }) => {
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Inter",
      padding: 40,
    },
    header: {
      marginBottom: 30,
      borderBottomWidth: 2,
      borderBottomColor: "#4f46e5",
      paddingBottom: 20,
    },
    section: {
      marginBottom: 20,
    },
    h1: {
      fontSize: 24,
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: 8,
    },
    h2: {
      fontSize: 18,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 6,
    },
    text: {
      fontSize: 12,
      color: "#4b5563",
      marginBottom: 4,
    },
    grid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    total: {
      fontSize: 14,
      fontWeight: 600,
      color: "#1f2937",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.h1}>{appointment.salon.salon_name}</Text>
          <Text style={styles.text}>Invoice #{appointment.id.slice(0, 8)}</Text>
          <Text style={styles.text}>{appointment.salon.contact_number}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.section}>
            <Text style={styles.h2}>Client Details</Text>
            <Text style={styles.text}>{appointment.client.client_name}</Text>
            <Text style={styles.text}>{appointment.client.email}</Text>
            <Text style={styles.text}>{appointment.client.contact}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.h2}>Appointment Details</Text>
            <Text style={styles.text}>
              Date: {new Date(appointment.date).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>Time: {appointment.time}</Text>
            <Text style={styles.text}>Status: {appointment.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Service Details</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Service:</Text>
            <Text style={styles.text}>{appointment.service.service_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Duration:</Text>
            <Text style={styles.text}>{appointment.service.time} minutes</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Staff:</Text>
            <Text style={styles.text}>{appointment.staff.fullname}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Location:</Text>
            <Text style={styles.text}>
              {appointment.branch.branch_location}
            </Text>
          </View>
        </View>

        <View style={[styles.row, { marginTop: 20 }]}>
          <Text style={styles.total}>Total Amount:</Text>
          <Text style={styles.total}>
            ${appointment.service.service_price.toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredAppointments, setFilteredAppointments] =
    useState<Appointment[]>(initialAppointments);
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [clientName, setClientName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Filter appointments with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = initialAppointments.filter((appointment) => {
        const matchesSearch = [
          appointment.client.client_name.toLowerCase(),
          appointment.client.contact.toLowerCase(),
          appointment.client.email.toLowerCase(),
          appointment.service.service_name.toLowerCase(),
          appointment.staff.fullname.toLowerCase(),
          appointment.branch.branch_name.toLowerCase(),
          appointment.service.service_price.toString(),
        ].some((value) => value.includes(searchQuery.toLowerCase()));

        const matchesAdvanced = [
          clientName
            ? appointment.client.client_name
                .toLowerCase()
                .includes(clientName.toLowerCase())
            : true,
          serviceName
            ? appointment.service.service_name
                .toLowerCase()
                .includes(serviceName.toLowerCase())
            : true,
          selectedStatus ? appointment.status === selectedStatus : true,
          selectedDate ? appointment.date === selectedDate : true,
        ].every(Boolean);

        return matchesSearch && matchesAdvanced;
      });

      setFilteredAppointments(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, clientName, serviceName, selectedStatus, selectedDate]);

  const handleDownloadInvoice = async (appointment: Appointment) => {
    const blob = await pdf(
      <InvoiceDocument appointment={appointment} />
    ).toBlob();
    saveAs(blob, `invoice-${appointment.id}.pdf`);
  };

  // Handle scroll progress
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
  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all salon appointments
          </p>
        </div>

        {/* Modern Search Bar */}
        <motion.div
          layout
          className={`relative ${
            isExpanded ? "w-full md:w-96" : "w-full md:w-94"
          }`}
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                isExpanded
                  ? "Search by client, service, staff, branch or price..."
                  : "Search appointments..."
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

          {/* Advanced Search (appears when expanded) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      placeholder="Filter by client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      placeholder="Filter by service"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold">
                {filteredAppointments.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
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
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold">
                {
                  filteredAppointments.filter((a) => a.status === "confirmed")
                    .length
                }
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
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
              <p className="text-sm text-gray-500">Services Booked</p>
              <p className="text-2xl font-bold">
                {
                  new Set(
                    filteredAppointments.map((a) => a.service.service_name)
                  ).size
                }
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <FiScissors className="text-xl" />
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
                {filteredAppointments
                  .reduce((sum, a) => sum + a.service.service_price, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Custom Scrollbar Track */}
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
                  <FiUser className="inline mr-1" /> Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  <FiScissors className="inline mr-1" /> Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  <FiMapPin className="inline mr-1" /> Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  <FiCalendar className="inline mr-1" /> Date/Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  <FiDollarSign className="inline mr-1" /> Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredAppointments.map((appointment) => (
                  <motion.tr
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-indigo-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {appointment.client.client_name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.client.client_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            #{appointment.id.split("-")[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.client.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.client.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.service.service_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.service.time} mins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                          {appointment.staff.fullname
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-3 text-sm text-gray-900">
                          {appointment.staff.fullname}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.branch.branch_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.branch.branch_location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-indigo-600">
                          ${appointment.service.service_price.toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleDownloadInvoice(appointment)}
                          className="p-1 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Download Invoice"
                        >
                          <FiDownload className="text-indigo-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[appointment.status]
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredAppointments.length === 0 && (
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
                No appointments found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>

        <AppointmentManagementForm />
      </motion.div>
    </div>
  );
}
