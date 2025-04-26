// components/SalonSetup/StepOne.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  FiUploadCloud,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { usePathname } from "next/navigation";

interface FormData {
  salonName: string;
  tagline: string;
  openingDate: string;
  email: string;
  phone: string;
  salonImg: File | null;
}

const floatingVariants = {
  hidden: { y: 10, opacity: 1 },
  visible: { y: 0, opacity: 1 },
};

export const StepOne = ({ setStep }: { setStep: (step: number) => void }) => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({ mode: "onChange" });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setValue("salonImg", acceptedFiles[0], { shouldValidate: true });
    },
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setValue("salonImg", null);
    trigger("salonImg");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (!data.salonImg) throw new Error("Salon image is required");

      // Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", data.salonImg);
      cloudinaryFormData.append("upload_preset", "salon_preset");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dl1lqotns/image/upload",
        { method: "POST", body: cloudinaryFormData }
      );

      if (!cloudinaryResponse.ok) throw new Error("Image upload failed");
      const cloudinaryData = await cloudinaryResponse.json();

      // Prepare salon data
      const salonData = {
        salon_name: data.salonName,
        salon_tag: data.tagline,
        opening_time: data.openingDate,
        contact_email: data.email,
        contact_number: data.phone,
        salon_img_url: cloudinaryData.secure_url,
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

      if (!response.ok) throw new Error("Salon creation failed");
      setStep(2);
    } catch (error: unknown) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.salonImg instanceof File) {
        setPreview(URL.createObjectURL(value.salonImg));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-4"
        >
          Create Your Salon Profile
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300 text-lg"
        >
          Let us start with the basic information to set up your salon
        </motion.p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Salon Name */}
          <motion.div variants={floatingVariants} className="relative z-0">
            <input
              {...register("salonName", {
                required: "Salon name is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
              className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
              placeholder=" "
            />
            <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Salon Name *
            </label>
            <div className="absolute right-4 top-5">
              <AnimatePresence>
                {errors.salonName ? (
                  <FiAlertCircle className="text-rose-500" />
                ) : (
                  watch("salonName") && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <FiCheckCircle className="text-emerald-500" />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
            {errors.salonName && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-rose-500"
              >
                {errors.salonName.message}
              </motion.p>
            )}
          </motion.div>

          {/* Tagline */}
          <motion.div variants={floatingVariants} className="relative z-0">
            <input
              {...register("tagline")}
              className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
              placeholder=" "
            />
            <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Tagline (Optional)
            </label>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opening Date */}
          <motion.div variants={floatingVariants} className="relative z-0">
            <input
              type="date"
              {...register("openingDate", {
                required: "Opening date is required",
              })}
              className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
            />
            <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Opening Date *
            </label>
            {errors.openingDate && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-rose-500"
              >
                {errors.openingDate.message}
              </motion.p>
            )}
          </motion.div>

          {/* Phone Number */}
          <motion.div variants={floatingVariants} className="relative z-0">
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "10 digits required",
                },
              })}
              className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
              placeholder=" "
            />
            <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Phone Number *
            </label>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-rose-500"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Email */}
        <motion.div variants={floatingVariants} className="relative z-0">
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
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

        {/* Image Upload */}
        <motion.div variants={floatingVariants} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Salon Photo *
          </label>
          <div
            {...getRootProps()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300
              ${
                isDragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-300 hover:border-emerald-400"
              }
              ${errors.salonImg ? "border-rose-500 bg-rose-50" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4 text-center">
              {preview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <img
                    src={preview}
                    alt="Salon preview"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-lg hover:bg-rose-50 transition-colors"
                  >
                    <FiX className="text-rose-500 text-lg" />
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        scale: isHovered || isDragActive ? 1.1 : 1,
                        y: isHovered || isDragActive ? -5 : 0,
                      }}
                    >
                      <FiUploadCloud className="text-3xl mx-auto text-emerald-500" />
                    </motion.div>
                  </div>
                  <motion.p
                    animate={{ color: isDragActive ? "#10B981" : "#6B7280" }}
                    className="text-sm font-medium"
                  >
                    {isDragActive
                      ? "Drop it here!"
                      : "Drag & drop or click to upload"}
                  </motion.p>
                  <p className="text-xs text-gray-400">
                    JPEG, PNG, WEBP (Max 5MB)
                  </p>
                </>
              )}
            </div>
            <motion.div
              animate={{
                opacity: isDragActive ? 1 : 0,
                scale: isDragActive ? 1 : 0.9,
              }}
              className="absolute inset-0 bg-emerald-500/10 rounded-2xl pointer-events-none"
            />
          </div>
          {errors.salonImg && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose-500"
            >
              <FiAlertCircle className="inline mr-1" />{" "}
              {errors.salonImg.message}
            </motion.p>
          )}
        </motion.div>

        {/* Form Actions */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {submissionError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2 text-sm"
              >
                <FiAlertCircle className="flex-shrink-0" />
                {submissionError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold
                      disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="block w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
              />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue to Next Step
                <FiCheckCircle className="text-lg" />
              </span>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};
