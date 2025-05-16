"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiMapPin,
  FiUsers,
  FiScissors,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { AnimatedButton } from "@/Components/ui/Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
    if (!pathname) return;
    const segment = pathname.split("/")[1] || "";
    const id = segment.endsWith("-u") ? segment.slice(0, -2) : segment;
    setUserId(id);
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
        );

        if (!userResponse.data.user?.salonId) {
          throw new Error("Salon not found");
        }

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

    if (userId) fetchData();
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
    const clientId = localStorage.getItem("client_id");

    if (!clientId) {
      setShowClientInfoModal(true);
      return;
    }

    handleConfirmBooking(clientId);
  };

  const handleClientInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/clients/addclients`,
        {
          client_name: clientInfo.name,
          email: clientInfo.email,
          contact: clientInfo.phone,
          salon_id: salonid,
        }
      );

      if (clientInfo.rememberMe) {
        localStorage.setItem("client_email", clientInfo.email);
      }

      const clientId = response.data.client.id;
      localStorage.setItem("client_id", clientId);
      handleConfirmBooking(clientId);
      setShowClientInfoModal(false);
    } catch (error) {
      toast.error("Failed to save client information");
      console.error(error);
    }
  };

  const handleConfirmBooking = async (clientId: string) => {
    try {
      if (
        !bookingForm.branch?.id ||
        !bookingForm.staff?.id ||
        !bookingForm.service?.id ||
        !bookingForm.date ||
        !bookingForm.time
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/create`,
        {
          salon_id: salonid,
          branch_id: bookingForm.branch.id,
          staff_id: bookingForm.staff.id,
          service_id: bookingForm.service.id,
          client_id: clientId,
          date: bookingForm.date.toISOString(),
          time: bookingForm.time,
          status: "pending",
        }
      );

      if (response.data.message === "Appointment created successfully") {
        toast.success("Appointment created!");
        setShowBookingModal(false);
        setBookingForm({
          branch: null,
          staff: null,
          service: null,
          date: null,
          time: "",
        });
      }
    } catch (error) {
      toast.error("Failed to create appointment");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff0ee]">
        {/* Hero Skeleton */}
        <div className="h-96 bg-gray-200 animate-pulse"></div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <Skeleton height={40} width={300} className="mx-auto mb-4" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <Skeleton height={28} width={200} className="mb-4" />
                <div className="space-y-3">
                  <Skeleton count={4} />
                  <Skeleton height={48} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0ee]">
      {/* Salon Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#7a5a57]/80 to-[#b76e79]/30 z-10" />
        <img
          src={user?.salon.salon_img_url || "/default-salon.jpg"}
          alt={user?.salon.salon_name}
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute bottom-0 left-0 right-0 z-20 text-center text-white pb-12 px-4">
          <motion.h1
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-5xl font-dancing font-bold mb-4 drop-shadow-lg"
          >
            {user?.salon.salon_name}
          </motion.h1>
          <p className="text-xl mb-6 text-[#fff0ee]">{user?.salon.salon_tag}</p>

          <div className="flex gap-6 justify-center">
            <div className="flex items-center gap-2 bg-[#7a5a57]/30 px-4 py-2 rounded-full">
              <FiClock className="text-[#fff0ee]" />
              <span>{user?.salon.opening_time}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#7a5a57]/30 px-4 py-2 rounded-full">
              <FiMapPin className="text-[#fff0ee]" />
              <span>{branches.length} Locations</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Branches Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-dancing text-center text-[#7a5a57] mb-12">
          Our Luxury Branches
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e8c4c0] hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#7a5a57] mb-4">
                  {branch.branch_name}
                </h3>

                <div className="space-y-3 text-[#9e6d70]">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-[#b76e79]" />
                    <span>{branch.branch_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[#b76e79]" />
                    <span>
                      {branch.opning_time} - {branch.closeings_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-[#b76e79]" />
                    <span>{branch.staffCount} Expert Stylists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiScissors className="text-[#b76e79]" />
                    <span>{branch.serviceCount} Premium Services</span>
                  </div>
                </div>

                <AnimatedButton
                  onClick={() => handleBookingStart(branch)}
                  variant="solid"
                  gradient={["#b76e79", "#d8a5a5"]}
                  className="w-full mt-6"
                  hoverScale={1.05}
                  tapScale={0.95}
                >
                  Book Appointment
                </AnimatedButton>
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg border border-[#e8c4c0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 relative">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-4 text-[#7a5a57] hover:text-[#b76e79]"
                >
                  <FiX className="text-2xl" />
                </button>

                <h3 className="text-2xl font-dancing text-[#7a5a57] mb-6">
                  Book Your Appointment
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step Indicator */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#b76e79] text-white flex items-center justify-center">
                        1
                      </div>
                      <div className="w-16 h-1 bg-[#e8c4c0]"></div>
                      <div className="w-8 h-8 rounded-full bg-[#e8c4c0] text-[#7a5a57] flex items-center justify-center">
                        2
                      </div>
                    </div>
                  </div>

                  {/* Staff Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                      <FiUser /> Select Stylist
                    </label>
                    <select
                      className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
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
                      <option value="">Choose Your Stylist</option>
                      {bookingForm.branch?.staff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.fullname}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                      <FiScissors /> Select Service
                    </label>
                    <select
                      className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
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

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                        <FiCalendar /> Select Date
                      </label>
                      <DatePicker
                        selected={bookingForm.date}
                        onChange={(date) =>
                          setBookingForm((prev) => ({ ...prev, date }))
                        }
                        minDate={new Date()}
                        className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
                        placeholderText="Choose Date"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                        <FiClock /> Select Time
                      </label>
                      <input
                        type="time"
                        className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
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

                  <AnimatedButton
                    type="submit"
                    variant="solid"
                    gradient={["#b76e79", "#d8a5a5"]}
                    className="w-full"
                    hoverScale={1.05}
                    tapScale={0.95}
                  >
                    Continue Booking (${bookingForm.service?.service_price || 0}
                    )
                  </AnimatedButton>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Info Modal */}
      <AnimatePresence>
        {showClientInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md border border-[#e8c4c0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 relative">
                <button
                  onClick={() => setShowClientInfoModal(false)}
                  className="absolute top-4 right-4 text-[#7a5a57] hover:text-[#b76e79]"
                >
                  <FiX className="text-2xl" />
                </button>

                <h3 className="text-2xl font-dancing text-[#7a5a57] mb-6">
                  Your Information
                </h3>

                <form onSubmit={handleClientInfoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                      <FiUser /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
                      value={clientInfo.name}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                      <FiMail /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
                      value={clientInfo.email}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9e6d70] flex items-center gap-2">
                      <FiPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full p-3 rounded-xl border-2 border-[#e8c4c0] focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
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
                      className="w-4 h-4 text-[#b76e79] rounded focus:ring-[#b76e79]"
                      checked={clientInfo.rememberMe}
                      onChange={(e) =>
                        setClientInfo({
                          ...clientInfo,
                          rememberMe: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-[#7a5a57]"
                    >
                      Remember my information
                    </label>
                  </div>

                  <AnimatedButton
                    type="submit"
                    variant="solid"
                    gradient={["#b76e79", "#d8a5a5"]}
                    className="w-full mt-4"
                    hoverScale={1.05}
                    tapScale={0.95}
                  >
                    Confirm Booking
                  </AnimatedButton>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
