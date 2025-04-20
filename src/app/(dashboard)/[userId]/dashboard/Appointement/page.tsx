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
  FiFlag,
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
import { usePathname } from "next/navigation";
import axios from "axios";

interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_contact: string;
  service_name: string;
  service_time: number;
  staff_name: string;
  location: string;
  date: string;
  time: string;
  price: number;
  status: string;
  salon_name: string;
}

interface UserResponse {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  password: string;
  profile_img?: string;
  salonId?: string;
  step?: number;
}

interface StaffResponse {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  password: string;
  profile_img?: string;
  user_id: string;
  branch_id: string;
  staff_id: string;
  user: UserResponse;
}

interface SalonResponse {
  id: string;
  salon_name: string;
  salon_tag: string;
  opening_time?: string;
  contact_email: string;
  contact_number: string;
  branch_url?: string;
  salon_img_url?: string;
}

interface BranchResponse {
  id: string;
  branch_name: string;
  branch_location: string;
  salon_id: string;
  contact_email: string;
  contact_number: string;
  opning_time: string;
  closeings_time: string;
}

interface ServiceResponse {
  id: string;
  service_name: string;
  service_price: number;
  time: number;
  branch_id: string;
}

interface ClientResponse {
  id: string;
  client_name: string;
  email: string;
  contact: string;
  branch_id: string;
  staff_id?: string;
  createdAt: string; // or Date if you parse it
}

interface AppointmentResponse {
  id: string;
  salon_id: string;
  branch_id: string;
  staff_id: string;
  service_id: string;
  client_id: string;
  date: string;
  time: string;
  status: string;
  salon: SalonResponse;
  branch: BranchResponse;
  staff: StaffResponse;
  service: ServiceResponse;
  client: ClientResponse;
}

// Sample Data (same as before)

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
      backgroundColor: "#f8fafc",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
      padding: 20,
      backgroundColor: "#ffffff",
      borderRadius: 12,
      shadowColor: "#64748b",
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    salonInfo: {
      flex: 2,
    },
    invoiceMeta: {
      flex: 1,
      alignItems: "flex-end",
    },
    decorativeStrip: {
      height: 4,
      width: "100%",
      marginVertical: 20,
      backgroundColor: "#4f46e5",
      borderRadius: 2,
    },
    section: {
      marginBottom: 24,
      padding: 20,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#0f172a",
      marginBottom: 16,
      letterSpacing: 0.5,
    },
    gridContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 20,
    },
    gridColumn: {
      flex: 1,
    },
    table: {
      marginVertical: 16,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 6,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#e2e8f0",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    tableHeader: {
      backgroundColor: "#f1f5f9",
      fontWeight: 600,
      color: "#475569",
    },
    tableCell: {
      flex: 1,
      fontSize: 12,
      color: "#475569",
    },
    totalContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 24,
    },
    totalBox: {
      width: "40%",
      padding: 16,
      backgroundColor: "#f8fafc",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
    priceText: {
      fontSize: 14,
      fontWeight: "semibold",
      color: "#0f172a",
      textAlign: "right",
    },
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: "#dcfce7",
      color: "#166534",
      fontSize: 10,
      fontWeight: 600,
    },
    watermark: {
      position: "absolute",
      right: 40,
      top: 200,
      fontSize: 48,
      color: "#e2e8f020",
      fontWeight: 800,
      transform: "rotate(-25deg)",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {appointment.status === "paid" && (
          <Text style={styles.watermark}>PAID</Text>
        )}

        <View style={styles.header}>
          <View style={styles.salonInfo}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              {appointment.salon_name}
            </Text>
            <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>
              {appointment.location}
            </Text>
            <Text style={{ fontSize: 12, color: "#64748b" }}>
              {appointment.client_contact}
            </Text>
          </View>

          <View style={styles.invoiceMeta}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#4f46e5",
                marginBottom: 8,
              }}
            >
              Invoice
            </Text>
            <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>
              #{appointment.id.slice(0, 8)}
            </Text>
            <Text style={{ fontSize: 12, color: "#64748b" }}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={[styles.gridColumn, { marginRight: 20 }]}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Client Details</Text>
              <Text style={{ fontSize: 14, color: "#0f172a", marginBottom: 4 }}>
                {appointment.client_name}
              </Text>
              <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>
                {appointment.client_email}
              </Text>
              <Text style={{ fontSize: 12, color: "#64748b" }}>
                {appointment.client_contact}
              </Text>
            </View>
          </View>

          <View style={styles.gridColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Appointment</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#64748b" }}>Date</Text>
                  <Text style={{ fontSize: 14, color: "#0f172a" }}>
                    {new Date(appointment.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#64748b" }}>Time</Text>
                  <Text style={{ fontSize: 14, color: "#0f172a" }}>
                    {appointment.time}
                  </Text>
                </View>
              </View>
              <View style={styles.badge}>
                {appointment.status.toUpperCase()}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Service</Text>
              <Text style={styles.tableCell}>Duration</Text>
              <Text style={styles.tableCell}>Staff</Text>
              <Text style={styles.tableCell}>Price</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{appointment.service_name}</Text>
              <Text style={styles.tableCell}>
                {appointment.service_time} mins
              </Text>
              <Text style={styles.tableCell}>{appointment.staff_name}</Text>
              <Text style={styles.tableCell}>
                ${appointment.price.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.totalBox}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={styles.priceText}>Subtotal:</Text>
              <Text style={styles.priceText}>
                ${appointment.price.toFixed(2)}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.priceText}>Total:</Text>
              <Text
                style={[styles.priceText, { color: "#4f46e5", fontSize: 16 }]}
              >
                ${appointment.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            padding: 16,
            backgroundColor: "#f1f5f9",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 10, color: "#64748b", textAlign: "center" }}>
            Thank you for choosing {appointment.salon_name}! Please present this
            invoice upon arrival. Cancellation policy applies.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const userid = pathname.split("/")[1];
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [clientName, setClientName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointment, setappointments] = useState<Appointment[]>([]);
  const [salonid, setsalonid] = useState("");

  useEffect(() => {
    const getsalonid = async () => {
      const userResponse = await fetch(
        `https://salon-backend-3.onrender.com/api/users/${userid}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      console.log(userData);

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user.salonId);
      console.log(userResponse);
    };
    getsalonid();
  }, [userid]);
  const [formbtn, setformbtn] = useState(false);

  useEffect(() => {
    const getappointment = async () => {
      const response = await axios.get(
        `https://salon-backend-3.onrender.com/api/appoiment/${salonid}`
      );
      if (response.data.appointments) {
        const data = response.data.appointments;
        setappointments(
          data.map((appoiment: AppointmentResponse) => ({
            id: appoiment.id,
            client_name: appoiment.client.client_name,
            client_email: appoiment.client.email,
            client_contact: appoiment.client.contact,
            service_name: appoiment.service.service_name,
            service_time: appoiment.service.time,
            staff_name: appoiment.staff.fullname,
            location: appoiment.branch.branch_location,
            date: appoiment.date,
            time: appoiment.time,
            price: appoiment.service.service_price,
            status: appoiment.status,
            salon_name: appoiment.salon.salon_name,
          }))
        );
      }
    };
    getappointment();
  }, [salonid, formbtn]);

  // Filter appointments with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = appointment.filter((appointment) => {
        const matchesSearch = [
          appointment.client_name.toLowerCase(),
          appointment.client_contact.toLowerCase(),
          appointment.client_email.toLowerCase(),
          appointment.service_name.toLowerCase(),
          appointment.staff_name.toLowerCase(),
          appointment.price.toString(),
        ].some((value) => value.includes(searchQuery.toLowerCase()));

        const matchesAdvanced = [
          clientName
            ? appointment.client_name
                .toLowerCase()
                .includes(clientName.toLowerCase())
            : true,
          serviceName
            ? appointment.service_name
                .toLowerCase()
                .includes(serviceName.toLowerCase())
            : true,
          selectedStatus ? appointment.status === selectedStatus : true,
          selectedDate ? appointment.date === selectedDate : true,
        ].every(Boolean);

        return matchesSearch && matchesAdvanced;
      });

      setappointments(filtered);
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
          } space-y-4`}
        >
          {/* Schedule Appointment Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setformbtn(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl shadow-lg
              transition-all duration-300 font-semibold text-lg flex items-center justify-center
              gap-2 hover:shadow-indigo-200 active:scale-95"
          >
            <FiCalendar className="text-xl" />
            Schedule Appointment
          </motion.button>

          {/* Search Section */}
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 z-10" />
            <input
              type="text"
              placeholder={
                isExpanded
                  ? "Search by client, service, staff, branch or price..."
                  : "Search appointments..."
              }
              className="w-full pl-11 pr-12 py-4 rounded-xl border-2 border-indigo-100 bg-white
               focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
               placeholder-gray-400 text-gray-700 transition-all duration-300 shadow-sm
               hover:border-indigo-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 rounded-lg
                text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
            >
              {isExpanded ? (
                <FiChevronUp className="w-5 h-5" />
              ) : (
                <FiChevronDown className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Advanced Search Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="mt-2 bg-white p-6 rounded-xl shadow-lg border border-indigo-50 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Input */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                      <FiUser className="text-indigo-500" />
                      Client Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-300
                       focus:ring-2 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400"
                      placeholder="Filter by client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>

                  {/* Service Input */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                      <FiScissors className="text-indigo-500" />
                      Service
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-300
                       focus:ring-2 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400"
                      placeholder="Filter by service"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                      <FiFlag className="text-indigo-500" />
                      Status
                    </label>
                    <select
                      className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-300
                        focus:ring-2 focus:ring-indigo-100 transition-all duration-200 appearance-none
                        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzVmOTAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] 
                        bg-no-repeat bg-[center_right_1rem]"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                      <FiCalendar className="text-indigo-500" />
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-300
                       focus:ring-2 focus:ring-indigo-100 transition-all duration-200
                       [&::-webkit-calendar-picker-indicator]:bg-indigo-500 
                       [&::-webkit-calendar-picker-indicator]:rounded-md
                       [&::-webkit-calendar-picker-indicator]:p-1"
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
              <p className="text-2xl font-bold">{appointment.length}</p>
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
                {appointment.filter((a) => a.status === "confirmed").length}
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
                {new Set(appointment.map((a) => a.service_name)).size}
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
                ${appointment.reduce((sum, a) => sum + a.price, 0).toFixed(2)}
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
                {appointment.map((appointment) => (
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
                          {appointment.client_name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.client_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            #{appointment.id.split("-")[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.client_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.client_contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.service_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.service_time} mins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                          {appointment.staff_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-3 text-sm text-gray-900">
                          {appointment.staff_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* <div className="text-sm font-medium text-gray-900">
                        {appointment.branch.branch_name}
                      </div> */}
                      <div className="text-xs text-gray-500">
                        {appointment.location}
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
                          ${appointment.price.toFixed(2)}
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

          {appointment.length === 0 && (
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

        {formbtn && (
          <AnimatePresence>
            {/* Backdrop with blur effect */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
              onClick={() => setformbtn(false)}
            >
              {/* Form Container - Prevent click propagation */}
              <div onClick={(e) => e.stopPropagation()}>
                <AppointmentManagementForm setformbtn={setformbtn} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
