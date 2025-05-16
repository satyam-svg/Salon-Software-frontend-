"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
  FiFilter,
  FiChevronDown,
  FiCheckSquare,
  FiSearch,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import { AnimatedButton } from "@/Components/ui/Button";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredReviewId, setHoveredReviewId] = useState<string | null>(null);
  const pathname = usePathname();
  const userid = pathname.split("/")[1];
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();

  const fetchBranches = useCallback(async () => {
    if (!userid) return;

    try {
      setScreenLoaderToggle(true);
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
    } finally {
      setScreenLoaderToggle(false);
    }
  }, [userid]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Get selected branch data
  const selectedBranchData = branches.find(
    (b) => b.branch_name === selectedBranch
  );
  const branchFeedbacks = selectedBranchData?.feedbacks || [];

  // Apply filters
  const filteredFeedbacks = branchFeedbacks.filter(
    (feedback) =>
      feedback.rating >= minRating &&
      (selectedDate ? feedback.date.startsWith(selectedDate) : true) &&
      (feedback.client.client_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        feedback.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.staff.fullname
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
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

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  return (
    <main className="min-h-screen p-8 mb-14">
      {/* Branch Selection and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] focus:ring-0 text-[#7a5a57]"
          >
            {branches.map((branch) => (
              <option key={branch.branch_name} value={branch.branch_name}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-[#9e6d70]" />
        </div>

        <div className="flex-1 flex gap-4">
          <div className="flex items-center gap-2 bg-[#fff0ee] p-3 rounded-xl max-w-md w-full">
            <FiSearch className="text-[#9e6d70]" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              className="bg-transparent w-full focus:outline-none text-[#7a5a57] placeholder-[#9e6d70]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <AnimatedButton
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            gradient={["#b76e79", "#d8a5a5"]}
            hoverScale={1.05}
            tapScale={0.95}
            className="px-6 py-3 rounded-xl"
            icon={<FiFilter className="text-lg" />}
            iconPosition="left"
          >
            Filter
          </AnimatedButton>
        </div>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-[#e8c4c0]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#9e6d70]">
                  Minimum Rating
                </label>
                <select
                  className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
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
                <label className="block text-sm font-medium mb-2 text-[#9e6d70]">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#b76e79]"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiStar className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Average Rating</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                {averageRating.toFixed(1)}/5
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#d8a5a5]"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiUser className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Feedbacks</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                {totalFeedbacks}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#9e6d70]"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiCheckSquare className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Featured Feedbacks</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                {featuredCount}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-[#e8c4c0]">
        <div className="p-6 border-b border-[#e8c4c0]">
          <h2 className="text-2xl font-semibold text-[#7a5a57] font-dancing">
            Client Feedback
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fff0ee]">
              <tr>
                {["Client", "Contact", "Date", "Rating", "Review", "Staff"].map(
                  (header) => (
                    <th
                      key={header}
                      className="p-4 text-left text-[#7a5a57] font-medium"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className="border-t border-[#e8c4c0] hover:bg-[#fff0ee] transition-colors"
                  >
                    <td className="p-4 font-medium text-[#7a5a57]">
                      {feedback.client.client_name}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-[#9e6d70]">
                          <FiPhone />
                          <span>{feedback.client.contact}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#9e6d70]">
                          <FiMail />
                          <span>{feedback.client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#9e6d70]">
                      {new Date(feedback.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 text-[#ffc107]">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={
                              i < feedback.rating ? "fill-current" : ""
                            }
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs relative">
                      <div
                        className="line-clamp-2 cursor-default relative text-[#7a5a57]"
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
                              className="absolute left-0 top-full z-50 mt-2 w-full bg-white shadow-lg rounded-lg p-4 border border-[#e8c4c0]"
                            >
                              <p className="text-sm text-[#7a5a57]">
                                {feedback.review}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                    <td className="p-4 text-[#9e6d70]">
                      {feedback.staff.fullname}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="text-[#9e6d70] mb-4">
                      <FiStar className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-[#7a5a57]">
                      No feedbacks found
                    </h3>
                    <p className="text-[#9e6d70] mt-1">
                      Try adjusting your search criteria
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default FeedbackManagementPage;
