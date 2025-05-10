"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckSquare,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import axios from "axios";

interface Feedback {
  id: string;
  date: string;
  feature: boolean;
  staff: {
    fullname: string;
  };
  client: {
    client_name: string;
    email: string;
    contact: string;
  };
  rating: number;
  review: string;
  service: string;
}

interface Branch {
  branch_name: string;
  feedbacks: Feedback[];
}

const FeedbackManagementPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [hoveredReviewId, setHoveredReviewId] = useState<string | null>(null);
  const pathname = usePathname();
  const userid = pathname.split("/")[1];

  const fetchBranches = useCallback(async () => {
    if (!userid) return;

    try {
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
      );

      const userData = userResponse.data;
      if (!userData.user?.salonId) throw new Error("Salon not found");

      const branchResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        { salon_id: userData.user.salonId }
      );

      const branchesData = branchResponse.data.branches || [];
      setBranches(branchesData);
      if (branchesData.length > 0) {
        setSelectedBranch(branchesData[0].branch_name);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  }, [userid]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const toggleFeature = async (
    feedbackId: string,
    currentFeatureStatus: boolean
  ) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/feedback/updatefeatur/${feedbackId}`,
        { isFeatured: !currentFeatureStatus }
      );

      setBranches((prev) =>
        prev.map((branch) => ({
          ...branch,
          feedback: branch.feedbacks.map((feedback) =>
            feedback.id === feedbackId
              ? { ...feedback, feature: !currentFeatureStatus }
              : feedback
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating feature status:", error);
    }
  };

  // Get selected branch data
  const selectedBranchData = branches.find(
    (b) => b.branch_name === selectedBranch
  );
  const branchFeedbacks = selectedBranchData?.feedbacks || [];

  // Apply filters
  const filteredFeedbacks = branchFeedbacks.filter(
    (feedback) =>
      feedback.rating >= minRating &&
      (selectedDate ? feedback.date.startsWith(selectedDate) : true)
  );
  // Statistics Calculations
  const totalFeedbacks = filteredFeedbacks.length;
  const averageRating =
    totalFeedbacks > 0
      ? filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
      : 0;
  const featuredCount = filteredFeedbacks.filter((f) => f.feature).length;

  // Rating Distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  filteredFeedbacks.forEach((f) => {
    if (f.rating >= 1 && f.rating <= 5) {
      ratingDistribution[f.rating - 1]++;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Branch Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
          >
            {branches.map((branch) => (
              <option key={branch.branch_name} value={branch.branch_name}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-gray-400" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white text-gray-600 px-6 py-3 rounded-xl border-2 border-gray-200"
        >
          <FiFilter className="text-lg" />
          Filter Feedbacks
        </motion.button>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Rating
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num === 0 ? "All Ratings" : `${num}+ Stars`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiStar className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUser className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Feedbacks</p>
              <p className="text-2xl font-bold">{totalFeedbacks}</p>
            </div>
          </div>
        </motion.div>

        {/* <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckSquare className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Featured Feedbacks</p>
              <p className="text-2xl font-bold">{featuredCount}</p>
            </div>
          </div>
        </motion.div> */}
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold">Client Feedback</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Review</th>

                <th className="p-4 text-left">Staff</th>
                {/* <th className="p-4 text-left">Featured</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <tr
                  key={feedback.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {feedback.client.client_name}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <FiPhone className="text-gray-500" />
                        <span>{feedback.client.contact}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMail className="text-gray-500" />
                        <span>{feedback.client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {new Date(feedback.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < feedback.rating ? "fill-current" : ""}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs relative">
                    <div
                      className="line-clamp-2 cursor-default relative"
                      onMouseEnter={() => setHoveredReviewId(feedback.id)}
                      onMouseLeave={() => setHoveredReviewId(null)}
                    >
                      {feedback.review}
                      <AnimatePresence>
                        {hoveredReviewId === feedback.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 top-full z-50 mt-2 w-full bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                          >
                            <p className="text-sm text-gray-700">
                              {feedback.review}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>

                  <td className="p-4">{feedback.staff.fullname}</td>
                  {/* <td className="p-4">
                    <input
                      type="checkbox"
                      checked={feedback.feature}
                      onChange={() =>
                        toggleFeature(feedback.id, feedback.feature)
                      }
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagementPage;
