"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiLock,
  FiSmartphone,
  FiMail,
  FiUpload,
  FiAlertCircle,
  FiEyeOff,
  FiEye,
} from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch: { id: string; name: string } | null;
}

const AddStaffModal = ({
  isOpen,
  onClose,
  selectedBranch,
}: AddStaffModalProps) => {
  const [staffData, setStaffData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
    profile_img: null as File | null,
    user_id: "",
    staff_id: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const pathname = usePathname();
  const userId = pathname.split("/")[1];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      setStaffData({ ...staffData, profile_img: acceptedFiles[0] });
      toast.success("Image selected");
    },
    onDropRejected: () => {
      setError("File must be an image (JPEG, PNG, WEBP) and less than 5MB");
      toast.error("File must be an image (JPEG, PNG, WEBP) and less than 5MB");
    },
  });

  useEffect(() => {
    if (staffData.profile_img) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(staffData.profile_img);
    } else {
      setPreview(null);
    }
  }, [staffData.profile_img]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedBranch) {
        toast.error("Please select a branch first");
        return;
      }
      if (!staffData.profile_img) {
        toast.error("Profile image is required");
        return;
      }

      setStep(2);
      const uploadToast = toast.loading("Uploading profile image...");

      const imageFormData = new FormData();

      imageFormData.append("file", staffData.profile_img);
      imageFormData.append("upload_preset", "salon_preset");

      const imageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dl1lqotns/image/upload",
        { method: "POST", body: imageFormData }
      );

      if (!imageResponse.ok) {
        toast.error("Image upload failed");
        throw new Error("Image upload failed");
      }
      toast.success("Image uploaded successfully", { id: uploadToast });
      const imageData = await imageResponse.json();

      const staffPayload = {
        ...staffData,
        user_id: userId,
        branch_id: selectedBranch.id,
        profile_img: imageData.secure_url,
      };

      const staffToast = toast.loading("Creating staff account...");

      const response = await fetch(
        "https://salon-backend-3.onrender.com/api/staff/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(staffPayload),
        }
      );
      console.log(staffPayload);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Staff creation failed", {
          id: staffToast,
        });
        throw new Error(errorData.message || "Staff creation failed");
      }
      toast.success("Staff created successfully!", { id: staffToast });
      setStep(3);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add staff");
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStaffData({
      fullname: "",
      contact: "",
      email: "",
      password: "",
      profile_img: null,
      user_id: "",
      staff_id: "",
    });
    setPreview(null);
    setStep(1);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetForm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
            style={{
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 mr-3">
                    <FiUser className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    Add Team Member In
                    {selectedBranch?.name && (
                      <span className="ml-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-sm">
                        {selectedBranch.name}
                      </span>
                    )}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="form-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Profile preview"
                            className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setStaffData({ ...staffData, profile_img: null });
                            }}
                            className="absolute top-0 right-0 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                          >
                            <FiX className="text-gray-500 text-xs" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-2">
                            <FiUpload className="text-emerald-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            {isDragActive
                              ? "Drop image here"
                              : "Upload profile photo"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPEG, PNG, WEBP (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={staffData.fullname}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                fullname: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="John Doe"
                          />
                          <FiUser className="absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={staffData.contact}
                            onChange={(e) => {
                              // Allow only numbers and limit to 10 digits
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setStaffData({
                                ...staffData,
                                contact: value,
                              });
                            }}
                            pattern="[0-9]{10}"
                            title="Please enter exactly 10 digits"
                            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="8345678934"
                          />
                          <FiSmartphone className="absolute left-3 top-3 text-gray-400" />
                          {staffData.contact.length === 10 && (
                            <span className="absolute right-3 top-3 text-emerald-500">
                              ✓
                            </span>
                          )}
                        </div>
                        {staffData.contact &&
                          staffData.contact.length !== 10 && (
                            <p className="mt-1 text-sm text-rose-500">
                              Please enter exactly 10 digits
                            </p>
                          )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={staffData.email}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="john@example.com"
                          />
                          <FiMail className="absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Generate StaffId
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={staffData.staff_id}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                staff_id: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="Generate Your Staff ID"
                          />
                          <FiLock className="absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Generate Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={staffData.password}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="Generate Your Staff Password"
                          />
                          <FiLock className="absolute left-3 top-3 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm"
                      >
                        <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="loading-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent mb-4"
                    ></motion.div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Adding Staff Member
                    </h3>
                    <p className="text-gray-500 text-center">
                      Please wait while we process your request...
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Success!
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                      Staff member has been added successfully.
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with buttons (only shown in form step) */}
            {step === 1 && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddStaff}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </>
                    ) : (
                      "Add Member"
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStaffModal;
