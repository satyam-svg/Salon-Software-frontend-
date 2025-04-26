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
  FiChevronDown,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  branch_name: string;
  branch_location: string;
  salon_id: string;
  contact_email: string;
  contact_number: string;
  opening_time: string;
  closing_time: string;
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

  const [, setSalonid] = useState("");
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
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userId);
        const userResponse = await axios.get(
          `https://salon-backend-3.onrender.com/api/users/${userId}`
        );
        if (!userResponse.data.user?.salonId)
          throw new Error("Salon not found");

        setSalonid(userResponse.data.user.salonId);
        setUser(userResponse.data.user);

        const branchResponse = await axios.post(
          "https://salon-backend-3.onrender.com/api/branch/isbranch",
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
    setActiveBranch(
      activeBranch === branch.branch_name ? null : branch.branch_name
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log("Booking Details:", bookingForm);
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
                      {branch.opening_time} - {branch.closing_time}
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
                  className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  Book Appointment
                  <FiChevronDown
                    className={`transform transition-transform ${
                      activeBranch === branch.branch_name ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              <AnimatePresence>
                {activeBranch === branch.branch_name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100"
                  >
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Staff Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Stylist
                        </label>
                        <select
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              staff:
                                branch.staff.find(
                                  (s) => s.id === e.target.value
                                ) || null,
                            }))
                          }
                        >
                          <option value="">Choose Your Stylist</option>
                          {branch.staff.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.fullname}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Service Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Service
                        </label>
                        <select
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              service:
                                branch.service.find(
                                  (s) => s.id === e.target.value
                                ) || null,
                            }))
                          }
                        >
                          <option value="">Choose Your Service</option>
                          {branch.service.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.service_name} - ${service.service_price}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Picker */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <DatePicker
                          selected={bookingForm.date}
                          onChange={(date) =>
                            setBookingForm((prev) => ({ ...prev, date }))
                          }
                          minDate={new Date()}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholderText="Choose a date"
                        />
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={bookingForm.time}
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              time: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-all"
                      >
                        Confirm Booking ($
                        {bookingForm.service?.service_price || "00"})
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
