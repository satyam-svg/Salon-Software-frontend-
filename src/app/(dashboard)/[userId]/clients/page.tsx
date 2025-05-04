"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiMapPin, FiUsers, FiScissors, FiX } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
interface User {
  salonId: string;
  salon: Salon;
}

interface Salon {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  branch_url: string;
  salon_img_url: string;
}

interface Branch {
  id: string;
  branch_name: string;
  branch_location: string;
  salon_id: string;
  contact_email: string;
  contact_number: string;
  opning_time: string;
  closeings_time: string;
  staffCount: number;
  serviceCount: number;
  inventoryCount: number;
  staff: Staff[];
  service: Service[];
}

interface Staff {
  id: string;
  fullname: string;
}

interface Service {
  id: string;
  service_name: string;
  service_price: number;
}

interface BookingForm {
  branch: Branch | null;
  staff: Staff | null;
  service: Service | null;
  date: Date | null;
  time: string;
}

export default function ClientPage() {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (!pathname) return;
    const segment = pathname.split("/")[1] || "";
    // agar segment "-u" se end hota hai, remove kar do
    const id = segment.endsWith("-u") ? segment.slice(0, -2) : segment;
    setUserId(id);
  }, [pathname]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showClientInfoModal, setShowClientInfoModal] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    rememberMe: false,
  });
  const [salonid, setSalonid] = useState("");
  const [user, setUser] = useState<User>();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    branch: null,
    staff: null,
    service: null,
    date: null,
    time: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userId);
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
        );
        if (!userResponse.data.user?.salonId)
          throw new Error("Salon not found");

        setSalonid(userResponse.data.user.salonId);
        setUser(userResponse.data.user);

        const branchResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
          { salon_id: userResponse.data.user.salonId }
        );

        setBranches(branchResponse.data.branches);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleBookingStart = (branch: Branch) => {
    setBookingForm({
      branch,
      staff: null,
      service: null,
      date: null,
      time: "",
    });
    setShowBookingModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientEmail = localStorage.getItem("client_email");
    const id = localStorage.getItem("client_id") || "";
    if (!clientEmail) {
      setShowClientInfoModal(true);
      return;
    }

    handleConfirmBooking(id);
  };
  const handleClientInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientInfo.rememberMe) {
      localStorage.setItem("client_email", clientInfo.email);
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/addclients`,
      {
        client_name: clientInfo.name,
        email: clientInfo.email,
        contact: clientInfo.phone,
        salon_id: salonid,
      }
    );
    console.log(response);
    localStorage.setItem("client_id", response.data.client.id);
    handleConfirmBooking(clientInfo.email);
    setShowClientInfoModal(false);
  };
  const handleConfirmBooking = async (id: string) => {
    const bookingDetails = {
      ...bookingForm,
      clientEmail: id,
      clientName: clientInfo.name || "Anonymous",
    };
    console.log("Booking Confirmed:", bookingDetails);
    try {
      // API call
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/create`,
        {
          salon_id: salonid,
          branch_id: bookingForm.branch?.id,
          staff_id: bookingForm.staff?.id,
          service_id: bookingForm.service?.id,
          client_id: id,
          date: bookingForm.date,
          time: bookingForm.time,
          status: "pending",
        }
      );

      if (response.data.message === "Appointment created successfully") {
        toast.success("Appointment created!");
        setShowBookingModal(false);
      }
    } catch (error) {
      toast.error("Failed to create appointment");
      console.log(error);
    }
    setShowBookingModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Salon Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={user?.salon.salon_img_url || "/default-salon.jpg"}
          alt={user?.salon.salon_name}
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-4">
              {user?.salon.salon_name}
            </h1>
            <p className="text-xl mb-6">{user?.salon.salon_tag}</p>
            <div className="flex gap-4 justify-center">
              <div className="flex items-center gap-2">
                <FiClock className="text-2xl" />
                <span>{user?.salon.opening_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-2xl" />
                <span>{branches.length} Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Luxury Branches
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <motion.div
              key={branch.branch_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {branch.branch_name}
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-indigo-600" />
                    <span>{branch.branch_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-indigo-600" />
                    <span>
                      {branch.opning_time} - {branch.closeings_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-indigo-600" />
                    <span>{branch.staffCount} Expert Staff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiScissors className="text-indigo-600" />
                    <span>{branch.serviceCount} Premium Services</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookingStart(branch)}
                  className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 relative">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-2xl" />
                </button>

                <h3 className="text-2xl font-bold mb-6">Book Appointment</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Staff Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Stylist
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                      required
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          staff:
                            bookingForm.branch?.staff.find(
                              (s) => s.id === e.target.value
                            ) || null,
                        }))
                      }
                    >
                      <option value="">Choose Stylist</option>
                      {bookingForm.branch?.staff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.fullname}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Service
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                      required
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          service:
                            bookingForm.branch?.service.find(
                              (s) => s.id === e.target.value
                            ) || null,
                        }))
                      }
                    >
                      <option value="">Choose Service</option>
                      {bookingForm.branch?.service.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.service_name} - ${service.service_price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Date
                      </label>
                      <DatePicker
                        selected={bookingForm.date}
                        onChange={(date) =>
                          setBookingForm((prev) => ({ ...prev, date }))
                        }
                        minDate={new Date()}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                        placeholderText="Select date"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                        value={bookingForm.time}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Continue (${bookingForm.service?.service_price || "0"})
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClientInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowClientInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 relative">
                <button
                  onClick={() => setShowClientInfoModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-2xl" />
                </button>

                <h3 className="text-2xl font-bold mb-6">Your Information</h3>
                <form onSubmit={handleClientInfoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                      value={clientInfo.name}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                      value={clientInfo.email}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                      value={clientInfo.phone}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="w-4 h-4"
                      checked={clientInfo.rememberMe}
                      onChange={(e) =>
                        setClientInfo({
                          ...clientInfo,
                          rememberMe: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="rememberMe" className="text-sm">
                      Remember my information
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
