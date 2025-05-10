"use client";

import { motion} from "framer-motion";
import { useState, useEffect } from "react";
import { FiStar, FiUser, FiMapPin, FiScissors, FiSend } from "react-icons/fi";
import { usePathname } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";



interface AppointmentData {
  appointmentDetails: {
    id: string;
    date: string;
    time: string;
    status: string;
  };
  clientDetails: {
    id: string;
    name: string;
    email: string;
    contact: string;
    createdAt: string;
  };
  staffDetails: {
    id: string;
    name: string;
    email: string;
    contact: string;
    branch: string;
    profileImage: string;
  };
  serviceDetails: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  branchDetails: {
    id: string;
    name: string;
    location: string;
    openingHours: string;
    contact: {
      email: string;
      phone: string;
    };
  };
  salonDetails: {
    id: string;
    name: string;
    contact: {
      email: string;
      phone: string;
    };
    image: string;
  };

}

export default function FeedbackPage() {
  const pathname = usePathname();
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    comment: "",
  });

  // Extract appointment ID from URL path
  const appointmentId = pathname?.split("/")[1]?.split("-a")[0];

  useEffect(() => {
    if (!appointmentId) return;

    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/feedback/getappointment/${appointmentId}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch appointment details");
        const data = await response.json();
        setAppointmentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId]);

  const handleSubmit = async () => {
    if (newFeedback.rating === 0 || !newFeedback.comment.trim()) {
      alert("Please add rating and comment");
      return;
    }


    if (!appointmentData) return;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/feedback/addfeedback`,{
        client_id:appointmentData.clientDetails.id,
        branch_id:appointmentData.branchDetails.id,
        staff_id:appointmentData.staffDetails.id,
        rating:newFeedback.rating,
        review:newFeedback.comment
    })
    toast.success(response.data.message || "feedback added")
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">No appointment data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Appointment Details Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative h-64 lg:h-full rounded-2xl overflow-hidden"
          >
            <img
              src={appointmentData.salonDetails.image}
              alt="Salon"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
              <h1 className="text-2xl font-bold text-white">
                {appointmentData.salonDetails.name}
              </h1>
              <p className="text-purple-200">
                {appointmentData.branchDetails.name}
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiMapPin className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Address</h3>
                <p className="font-medium">
                  {appointmentData.branchDetails.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiUser className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Your Stylist</h3>
                <p className="font-medium">
                  {appointmentData.staffDetails.name}
                </p>
                <p className="text-sm text-gray-500">
                  {appointmentData.staffDetails.contact}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiScissors className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Service Details</h3>
                <p className="font-medium">
                  {appointmentData.serviceDetails.name}
                </p>
                <p className="text-sm text-gray-500">
                  {appointmentData.serviceDetails.duration} mins • ₹
                  {appointmentData.serviceDetails.price}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiUser className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Appointment Date</h3>
                <p className="font-medium">
                  {new Date(
                    appointmentData.appointmentDetails.date
                  ).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {appointmentData.appointmentDetails.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Feedback Form */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-2xl shadow-xl h-fit sticky top-8"
          >
            <h2 className="text-2xl font-bold mb-6">Share Your Experience</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setNewFeedback({ ...newFeedback, rating: star })
                      }
                      className={`text-2xl ${
                        star <= newFeedback.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <FiStar />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={newFeedback.comment}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, comment: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full bg-purple-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FiSend className="text-lg" />
                Submit Feedback
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
