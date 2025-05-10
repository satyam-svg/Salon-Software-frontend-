"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiChevronRight,
  FiBriefcase,
  FiUsers,
  FiX,
  FiDollarSign,
} from "react-icons/fi";
import { useLogin } from "@/context/LoginContext";
import { useSignup } from "@/context/SignupContext";
import toast, { Toaster } from "react-hot-toast";
import { useForgetPassword } from "@/context/ForgetpassContext";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPopup = () => {
  const router = useRouter();
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";
  const [activeTab, setActiveTab] = useState<"owner" | "staff" | "salesman">(
    "owner"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iscross, setiscross] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    staffId: "",
    accessCode: "",
  });

  const { loginToggle, setLoginToggle } = useLogin();
  const { setSignupToggle } = useSignup();
  const { setForgetPasswordToggle } = useForgetPassword();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (activeTab === "owner") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        if (data.token) {
          document.cookie = `authToken=${data.token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }; SameSite=Lax; secure`;
        }

        const userId = data.user.id;
        if (data.user.email == "Veddikasiingh@gmail.com") {
          router.push(`/admin/adashboard`);
        } else {
          router.push(`/${userId}`);
        }

        toast.success("Welcome back, Luxury Owner!", {
          style: {
            background: "#f5f0f0",
            color: "#b76e79",
            border: "1px solid #e7d4d6",
          },
          iconTheme: {
            primary: "#b76e79",
            secondary: "#FFF",
          },
        });
        setLoginToggle(false);
      } else if (activeTab === "staff") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/staff/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              staffId: formData.staffId,
              password: formData.accessCode,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        const staffId = data.staff.id;
        try {
          const attendanceResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/attendence/add`,
            { staffId: staffId }
          );
          if (attendanceResponse.data.success) {
            toast.success(attendanceResponse.data.message);
          } else {
            toast.error(attendanceResponse.data.messag);
          }
        } catch (attendanceError) {
          console.error("Attendance error:", attendanceError);
          toast.error("Error recording attendance - contact manager");
        }

        if (data.token && data.expirationTime) {
          const expirationDate = new Date(data.expirationTime);
          const now = new Date();
          const maxAgeSeconds = Math.floor(
            (expirationDate.getTime() - now.getTime()) / 1000
          );

          if (maxAgeSeconds <= 0)
            throw new Error("Token expiration time is invalid");
          document.cookie = `staffToken=${data.token}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax; secure;`;

          router.push(`/${data.staff.id}/staffpage`);
          setLoginToggle(false);
        }
      } else if (activeTab === "salesman") {
        // Salesman Login Logic
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/salesman`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Salesman login failed");

        if (data.token) {
          document.cookie = `salesmanToken=${data.token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }; SameSite=Lax; secure`;
        }

        const salesmanId = data.salesman.id;
        router.push(`/${salesmanId}/salasemen`);

        toast.success("Welcome, Sales Representative!", {
          style: {
            background: "#f5f0f0",
            color: "#b76e79",
            border: "1px solid #e7d4d6",
          },
          iconTheme: {
            primary: "#b76e79",
            secondary: "#FFF",
          },
        });
        setLoginToggle(false);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during Login";
      if (error instanceof Error) errorMessage = error.message;

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

  useEffect(() => {
    const currentDomain = window.location.hostname;
    const isLocal =
      currentDomain === "evankiunisexsalon.in" ||
      currentDomain === "evankiunisexsalon.in";
    setiscross(!isLocal);
  }, []);

  if (!loginToggle) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-medium text-sm",
          duration: 3000,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {iscross && (
          <button
            onClick={() => setLoginToggle(false)}
            className="absolute top-4 right-4 z-50 p-2 hover:bg-rose-50/50 rounded-full transition-colors"
          >
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX className="text-2xl text-rose-700/90 hover:text-rose-800" />
            </motion.div>
          </button>
        )}

        <div
          className="relative h-40 flex flex-col items-center justify-end pb-6 px-8"
          style={{
            background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent" />
          <div className="absolute inset-0 opacity-10 pattern-diamonds pattern-white pattern-size-4" />

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">SalonSphere</h1>
            </div>
            <p className="text-white/90 text-sm font-light">
              Complete salon ecosystem
            </p>
          </motion.div>

          <motion.div
            className="flex gap-2 mt-6 relative bg-white/20 backdrop-blur-sm rounded-full p-1"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setActiveTab("owner")}
              className={`relative px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all z-10 ${
                activeTab === "owner"
                  ? "text-rose-800 bg-white/90 shadow-sm"
                  : "text-white hover:text-white/90"
              }`}
            >
              <FiBriefcase
                className={
                  activeTab === "owner" ? "text-rose-600" : "text-white"
                }
              />
              Owner
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`relative px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all z-10 ${
                activeTab === "staff"
                  ? "text-rose-800 bg-white/90 shadow-sm"
                  : "text-white hover:text-white/90"
              }`}
            >
              <FiUsers
                className={
                  activeTab === "staff" ? "text-rose-600" : "text-white"
                }
              />
              Staff
            </button>
            <button
              onClick={() => setActiveTab("salesman")}
              className={`relative px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all z-10 ${
                activeTab === "salesman"
                  ? "text-rose-800 bg-white/90 shadow-sm"
                  : "text-white hover:text-white/90"
              }`}
            >
              <FiDollarSign
                className={
                  activeTab === "salesman" ? "text-rose-600" : "text-white"
                }
              />
              Salesman
            </button>
          </motion.div>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {activeTab === "owner" ? (
                <motion.div
                  key="owner-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Professional Email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </motion.div>
              ) : activeTab === "staff" ? (
                <motion.div
                  key="staff-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      name="staffId"
                      type="text"
                      value={formData.staffId}
                      onChange={handleChange}
                      placeholder="Staff ID"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      name="accessCode"
                      type="password"
                      value={formData.accessCode}
                      onChange={handleChange}
                      placeholder="Access Code"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="salesman-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Salesman Email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="text-red-500 text-sm text-center mb-2">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {activeTab !== "salesman" && (
                <a
                  onClick={() => {
                    setLoginToggle(false);
                    setForgetPasswordToggle(true);
                  }}
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium cursor-pointer"
                >
                  Forgot {activeTab === "owner" ? "Password?" : "Code?"}
                </a>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all mt-4
                ${
                  isSubmitting
                    ? "bg-rose-300 cursor-not-allowed"
                    : "text-white shadow-md hover:shadow-rose-200/50"
                }`}
              style={{
                background: isSubmitting
                  ? "#b76e79"
                  : `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`,
              }}
            >
              <span className="font-medium">
                {isSubmitting
                  ? "Authenticating..."
                  : activeTab === "owner"
                  ? "Owner Access"
                  : activeTab === "staff"
                  ? "Staff Portal"
                  : "Salesman Login"}
              </span>
              {!isSubmitting && <FiChevronRight className="text-white" />}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm text-gray-600 pt-4 border-t border-gray-100"
          >
            {activeTab === "owner" ? (
              <p>
                New luxury partner?{" "}
                <button
                  onClick={() => {
                    setLoginToggle(false);
                    setSignupToggle(true);
                  }}
                  className="text-rose-600 hover:text-rose-700 font-medium focus:outline-none"
                >
                  Join our elite circle
                </button>
              </p>
            ) : activeTab === "staff" ? (
              <p>
                Need staff credentials?{" "}
                <a
                  href="#"
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  Contact management
                </a>
              </p>
            ) : (
              <p>
                Need salesman account?{" "}
                <a
                  href="#"
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  Contact administration
                </a>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPopup;
