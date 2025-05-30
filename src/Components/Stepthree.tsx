"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhone,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import AddStaffModal from "@/Components/AddStaffModal";
import { usePathname } from "next/navigation";
import { FaUserTie } from "react-icons/fa";

interface Branch {
  id: string;
  name: string;
  location: string;
  openingTime: string;
  closingTime: string;
  email: string;
  contact: string;
  staffCount: number;
}

interface BranchAPIResponse {
  id: string;
  branch_name: string;
  branch_location: string;
  opning_time: string;
  closeings_time: string;
  contact_email: string;
  contact_number: string;
  serviceCount: number;
  inventoryCount: number;
  staffCount: number;
}

interface StepThreeProps {
  setStep: (step: number) => void;
}

export default function StepThree({ setStep }: StepThreeProps) {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [branches, setBranches] = useState<Branch[]>([]);
  const [salonid, setsaloid] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<{
    id: string;
    branch_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);

  const updateStep = async () => {
    const salonData = {
      salonId: salonid,
      step: 3,
      user_id: userId,
    };

    // Submit to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/salon/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salonData),
      }
    );
    console.log(response);
    setStep(4);
  };
  const fetchBranches = async () => {
    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsaloid(userData.user.salonId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salon_id: userData.user.salonId }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch branches");

      const data = await response.json();
      setBranches(
        data.branches.map((branch: BranchAPIResponse) => ({
          id: branch.id,
          name: branch.branch_name,
          location: branch.branch_location,
          openingTime: branch.opning_time,
          closingTime: branch.closeings_time,
          email: branch.contact_email,
          contact: branch.contact_number,
          staffCount: branch.staffCount,
        }))
      );
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch branches");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50"
      >
        <div className="text-red-600 p-6 bg-white rounded-xl shadow-xl max-w-md text-center">
          <FiAlertCircle className="inline-block text-2xl mb-2" />
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col items-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-2 text-center"
        >
          Manage Your Team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300 text-center"
        >
          Add staff members to each of your salon branches
        </motion.p>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {branches.map((branch) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {branch.name}
                  </h3>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-purple-500" />
                    <p>{branch.location}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiClock className="text-emerald-500" />
                    <p>
                      {branch.openingTime} - {branch.closingTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiMail className="text-rose-500" />
                    <p>{branch.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiPhone className="text-blue-500" />
                    <p>{branch.contact}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-blue-500 text-xl" />
                    <p> Staff :- {branch.staffCount}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedBranch({
                      id: branch.id,
                      branch_name: branch.name,
                    });
                    setShowAddStaff(true);
                  }}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FiUser /> Add Staff Member
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AddStaffModal
        isOpen={showAddStaff}
        onClose={() => {
          fetchBranches();
          setShowAddStaff(false);
        }}
        selectedBranch={selectedBranch}
      />

      <motion.div
        className="mt-12 flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"></motion.button>

        <motion.button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"></motion.button>

        <motion.button
          onClick={() => {
            updateStep();
          }}
          disabled={branches.length === 0}
          whileHover={{ x: 5 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
            branches.length === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg"
          }`}
        >
          Next Step
          <FiChevronRight />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
