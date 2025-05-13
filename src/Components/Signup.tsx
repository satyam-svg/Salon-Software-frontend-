"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiChevronRight,
  FiX,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiCheck,
  FiXCircle,
  FiCheckCircle,
  FiRotateCw,
  FiGift,
} from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useSignup } from "@/context/SignupContext";
import { useLogin } from "@/context/LoginContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Signup = () => {
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";
  const { setLoginToggle } = useLogin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { signupToggle, setSignupToggle } = useSignup();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState<number | null>(null);
  const [iscross, setiscross] = useState(true);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [otpValid, setOtpValid] = useState<boolean | null>(null);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    const isLocal =
      currentDomain === "evankiunisexsalon.in" ||
      currentDomain === "evankiunisexsalon.in";
    setiscross(!isLocal);
  }, []);

  useEffect(() => {
    if (enteredOtp.length === 6 && otpSent) {
      setOtpValid(enteredOtp === otpSent.toString());
    } else {
      setOtpValid(null);
    }
  }, [enteredOtp, otpSent]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpResendTimer]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
    onDrop,
  });

  const validateContact = (contact: string) => /^\d{10}$/.test(contact);
  const validatePassword = () => Object.values(passwordChecks).every(Boolean);

  const handleSendOtp = async (isResend = false) => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/email/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: email }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(data.otp);
      setIsOtpSent(true);
      setEnteredOtp("");
      setOtpValid(null);
      setOtpResendTimer(60);
      toast.success(
        isResend ? "New OTP sent to your email!" : "OTP sent to your email!"
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const router = useRouter();
  const handleResendOtp = async () => {
    await handleSendOtp(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const fullname = formData.get("fullname") as string;
      const referralCode = formData.get("referralCode") as string;
      const contact = formData.get("contact") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!isOtpSent) throw new Error("Please verify your email first");
      if (!enteredOtp) throw new Error("Please enter the OTP");
      // if (!profileImageFile) throw new Error("Please upload a profile image");
      if (!validateContact(contact))
        throw new Error("Contact number must be 10 digits");
      if (!validatePassword())
        throw new Error("Please meet all password requirements");
      if (password !== confirmPassword)
        throw new Error("Passwords do not match");
      if (enteredOtp !== otpSent?.toString()) throw new Error("Invalid OTP");

      // Upload image to Cloudinary
      let profile_img =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjhv8n_2sZacewq1nWAz-Qre9bWT7l98q1ph2CdW_r02GjRqrIHTydD6I&s"; // default image

      if (profileImageFile) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", profileImageFile);
        cloudinaryFormData.append("upload_preset", "salon_preset");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dl1lqotns/image/upload`,
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Image upload failed");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        profile_img = cloudinaryData.secure_url; // overwrite default only if upload is successful
      }

      // Create user account
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname,
            email,
            contact,
            password,
            profile_img,
            referralCode,
          }),
        }
      );

      if (!userResponse.ok) {
        const text = await userResponse.text();
        throw new Error(text.startsWith("{") ? JSON.parse(text).message : text);
      }

      // Token handling
      const responseData = await userResponse.json();
      if (responseData.token) {
        document.cookie = `authToken=${responseData.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`;
      }

      toast.success("Welcome to LuxeSalon Suite!", {
        style: {
          background: "#f5f0f0",
          color: "#b76e79",
          border: "1px solid #e7d4d6",
        },
        duration: 4000,
      });
      setSignupToggle(false);
      const userId = responseData.user.id;
      if (responseData.user.email == "21012003rs@gmail.com") {
        router.push(`/admin/adashboard`);
      } else {
        router.push(`/${userId}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during signup";
      toast.error(errorMessage, {
        style: {
          background: "#fdf3f4",
          color: "#c23b3b",
          border: "1px solid #f5c6cb",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!signupToggle) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Toaster
        position="top-center"
        toastOptions={{ className: "font-medium text-sm", duration: 5000 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {iscross && (
          <button
            onClick={() => setSignupToggle(false)}
            className="absolute top-4 right-4 z-50 p-2 hover:bg-rose-50/50 rounded-full"
          >
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX className="text-2xl text-rose-700/90" />
            </motion.div>
          </button>
        )}

        <div
          className="relative h-32 flex flex-col items-center justify-end pb-4 px-6"
          style={{
            background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`,
          }}
        >
          <motion.div className="relative z-10 text-center">
            <h1 className="text-xl font-bold text-white">SalonSphere</h1>
            <p className="text-white/90 text-xs font-light">
              Complete Salon ecosystem
            </p>
          </motion.div>
        </div>

        <div
          className="p-6 pt-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div className="flex justify-center mb-3">
              <div
                {...getRootProps()}
                className="group cursor-pointer relative"
              >
                <input {...getInputProps()} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full bg-rose-100/20 border-2 border-dashed border-rose-200 flex items-center justify-center relative overflow-hidden"
                >
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FiCamera className="w-5 h-5 text-rose-200/80" />
                  )}
                </motion.div>
              </div>
            </motion.div>

            <div className="space-y-3">
              <div className="relative group">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
              </div>

              <div className="relative group">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Business Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsOtpSent(false);
                    setEnteredOtp("");
                    setOtpSent(null);
                  }}
                  className="w-full pl-9 pr-24 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={isOtpSent || isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 text-xs font-medium disabled:opacity-50 px-2 py-1 rounded bg-rose-50"
                >
                  {isOtpSent ? "OTP Sent" : "Send OTP"}
                </button>
              </div>

              {isOtpSent && (
                <div className="space-y-2">
                  <div className="relative group">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) =>
                        setEnteredOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                      required
                    />
                    {enteredOtp.length === 6 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {otpValid ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpResendTimer > 0 || isSubmitting}
                      className="text-xs text-rose-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      {otpResendTimer > 0 ? (
                        `Resend OTP in ${otpResendTimer}s`
                      ) : (
                        <>
                          <FiRotateCw size={12} />
                          Resend OTP
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="relative group">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="contact"
                  type="tel"
                  placeholder="10-digit Contact Number"
                  pattern="\d{10}"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {Object.entries(passwordChecks).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center ${
                      value ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {value ? (
                      <FiCheck className="mr-1" />
                    ) : (
                      <FiX className="mr-1" />
                    )}
                    <span>
                      {key === "length" && "8+ characters"}
                      {key === "uppercase" && "1 uppercase"}
                      {key === "lowercase" && "1 lowercase"}
                      {key === "number" && "1 number"}
                      {key === "specialChar" && "1 special (@$!%*?&)"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {password === confirmPassword ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <FiXCircle className="text-red-500" />
                    )}
                  </motion.div>
                )}
              </div>
              <div className="relative group">
                <FiGift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="referralCode"
                  type="text"
                  placeholder="Referral Code"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-gray-300 text-rose-500 focus:ring-rose-200 h-3.5 w-3.5"
                required
              />
              <label htmlFor="terms" className="text-gray-600 text-xs">
                I agree to the{" "}
                <a href="#" className="text-rose-600 font-medium">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || (isOtpSent && !otpValid)}
              className="w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-1 text-white shadow-md mt-3 text-sm disabled:opacity-70"
              style={{
                background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="h-3.5 w-3.5 border-2 border-white/30 rounded-full border-t-white animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  Become a Partner
                  <FiChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600 pt-3 border-t border-gray-100">
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setSignupToggle(false);
                  setLoginToggle(true);
                }}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                Access your suite
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
