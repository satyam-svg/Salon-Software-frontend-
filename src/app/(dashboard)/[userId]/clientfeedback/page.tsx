"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiStar, FiUser, FiMapPin, FiScissors, FiSend } from "react-icons/fi";

interface Feedback {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface SalonDetails {
  salonName: string;
  branchName: string;
  staffName: string;
  address: string;
  image: string;
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([
    {
      id: 1,
      clientName: "Rahul Sharma",
      rating: 5,
      comment: "Best salon experience ever! The stylists are true artists.",
      date: "2023-08-15",
    },
    {
      id: 2,
      clientName: "Priya Singh",
      rating: 4,
      comment: "Loved the ambiance and professional service.",
      date: "2023-08-14",
    },
  ]);

  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    comment: "",
  });

  const salonDetails: SalonDetails = {
    salonName: "Glamour Studio",
    branchName: "South Delhi Branch",
    staffName: "Anjali Kapoor",
    address: "12th Floor, GK Tower, Greater Kailash, New Delhi",
    image: "https://picsum.photos/600/400?random=1",
  };

  const handleSubmit = () => {
    if (newFeedback.rating === 0 || !newFeedback.comment.trim()) {
      alert("Please add rating and comment");
      return;
    }

    const newEntry: Feedback = {
      id: feedbackList.length + 1,
      clientName: "Current User", // Replace with actual user name
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      date: new Date().toISOString().split("T")[0],
    };

    setFeedbackList([newEntry, ...feedbackList]);
    setNewFeedback({ rating: 0, comment: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Salon Details Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative h-64 lg:h-full rounded-2xl overflow-hidden"
          >
            <img
              src={salonDetails.image}
              alt="Salon"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
              <h1 className="text-2xl font-bold text-white">
                {salonDetails.salonName}
              </h1>
              <p className="text-purple-200">{salonDetails.branchName}</p>
            </div>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiMapPin className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Address</h3>
                <p className="font-medium">{salonDetails.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiUser className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Your Stylist</h3>
                <p className="font-medium">{salonDetails.staffName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiScissors className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Recent Service</h3>
                <p className="font-medium">Hair Spa & Styling</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Feedback List */}
          <div className="space-y-6">
            <AnimatePresence>
              {feedbackList.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <FiUser className="text-2xl text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{feedback.clientName}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(feedback.rating)].map((_, i) => (
                            <FiStar key={i} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{feedback.comment}</p>
                      <p className="text-sm text-gray-400">{feedback.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
