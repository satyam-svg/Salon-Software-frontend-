// components/SalonSetup/StepTwo.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiPlus,
  FiChevronRight,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiMapPin,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
interface Branch {
  id: string;
  name: string;
  openingTime: string;
  location: string;
  closingTime: string;
  email: string;
  contact: string;
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
}

interface FormData {
  branchName: string;
  location: string;
  openingTime: string;
  closingTime: string;
  email: string;
  contact: string;
}

const floatingVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const StepTwo = ({ setStep }: { setStep: (step: number) => void }) => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [salonId, setSalonId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({ mode: "onChange" });
  const updateStep = async () => {
    const salonData = {
      salonId: salonId,
      step: 2,
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
    setStep(3);
  };
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get user data to find salonId
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();

        if (!userData.user?.salonId) throw new Error("Salon not found");
        setSalonId(userData.user.salonId);

        // Get existing branches
        const branchResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ salon_id: userData.user.salonId }),
          }
        );

        const branchData = await branchResponse.json();
        if (branchData.isbranch) {
          console.log(branchData);
          setBranches(
            branchData.branches.map((branch: BranchAPIResponse) => ({
              id: branch.id,
              name: branch.branch_name,
              location: branch.branch_location,
              openingTime: branch.opning_time,
              closingTime: branch.closeings_time,
              email: branch.contact_email,
              contact: branch.contact_number,
            }))
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) initializeData();
  }, [userId]);
  const onSubmit = async (formData: FormData) => {
    setIsSaving(true);
    try {
      // Create new branch
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branch_name: formData.branchName,
            branch_location: formData.location,
            salon_id: salonId,
            contact_email: formData.email,
            contact_number: formData.contact,
            opning_time: formData.openingTime,
            closeings_time: formData.closingTime,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create branch");

      // Refresh branches list
      const newBranchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salon_id: salonId }),
        }
      );

      const newBranchData = await newBranchResponse.json();
      setBranches(
        newBranchData.branches.map((branch: BranchAPIResponse) => ({
          id: branch.id,
          name: branch.branch_name,
          location: branch.branch_location,
          openingTime: branch.opning_time,
          closingTime: branch.closeings_time,
          email: branch.contact_email,
          contact: branch.contact_number,
        }))
      );

      reset();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save branch");
    } finally {
      setIsSaving(false);
    }
  };
  if (loading)
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300"
        >
          Loading branches...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-rose-500">
        {error}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-4"
        >
          Manage Branches
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300 text-lg"
        >
          Add multiple branches to your salon network
        </motion.p>
      </div>

      {/* Saved Branches List */}
      <AnimatePresence>
        {branches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 space-y-4"
          >
            {branches.map((branch) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-start group hover:shadow-md transition-shadow"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {branch.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="flex-shrink-0 text-rose-400" />
                      <span className="truncate">{branch.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiClock className="flex-shrink-0 text-emerald-400" />
                      <span>
                        {branch.openingTime} - {branch.closingTime}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FiMail className="flex-shrink-0 text-blue-400" />
                        <span className="truncate">{branch.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="flex-shrink-0 text-indigo-400" />
                        <span>{branch.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Form */}
      <AnimatePresence>
        {(isEditing || branches.length === 0) && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Branch Name */}
              <motion.div variants={floatingVariants} className="relative z-0">
                <input
                  {...register("branchName", {
                    required: "Branch name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Branch Name *
                </label>
                <div className="absolute right-4 top-5">
                  <AnimatePresence>
                    {errors.branchName ? (
                      <FiAlertCircle className="text-rose-500" />
                    ) : (
                      watch("branchName") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <FiCheckCircle className="text-emerald-500" />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>
                {errors.branchName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.branchName.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Location */}
              <motion.div variants={floatingVariants} className="relative z-0">
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Location *
                </label>
                {errors.location && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.location.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Opening Hours */}
              <div className="space-y-6">
                <motion.div
                  variants={floatingVariants}
                  className="relative z-0"
                >
                  <div className="flex items-center gap-3">
                    <FiClock className="text-emerald-500" />
                    <input
                      type="time"
                      {...register("openingTime", {
                        required: "Opening time is required",
                      })}
                      className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                    />
                  </div>
                  <label className="absolute top-4 left-10 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Opening Time *
                  </label>
                  {errors.openingTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-rose-500"
                    >
                      {errors.openingTime.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  className="relative z-0"
                >
                  <div className="flex items-center gap-3">
                    <FiClock className="text-emerald-500" />
                    <input
                      type="time"
                      {...register("closingTime", {
                        required: "Closing time is required",
                      })}
                      className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                    />
                  </div>
                  <label className="absolute top-4 left-10 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Closing Time *
                  </label>
                  {errors.closingTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-rose-500"
                    >
                      {errors.closingTime.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Contact Info */}
              <motion.div variants={floatingVariants} className="relative z-0">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Email Address *
                </label>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={floatingVariants} className="relative z-0">
                <input
                  type="tel"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "10 digits required",
                    },
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Contact Number *
                </label>
                {errors.contact && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.contact.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              {branches.length > 0 && (
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-gray-600 hover:text-rose-500 transition-colors"
                >
                  Cancel
                </motion.button>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!isValid || isSaving} // Add isSaving to disabled condition
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold disabled:opacity-50 relative"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : branches.length === 0 ? (
                  "Save Branch"
                ) : (
                  "Add Branch"
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Add New Branch Button */}
      {!isEditing && branches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            Add New Branch
          </motion.button>
        </motion.div>
      )}

      {/* Navigation Controls */}
      <motion.div
        className="mt-12 flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          onClick={() => setStep(1)}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
        ></motion.button>

        <motion.button
          onClick={() => updateStep()}
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
};
