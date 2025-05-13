// app/unauthorized/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaArrowRight } from "react-icons/fa";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#e8c4c0 0.5px, transparent 0.5px)",
        backgroundSize: "15px 15px",
        backgroundColor: "#fff9f7",
      }}
    >
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full h-48 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-[#b76e79] opacity-20"
          />
        </svg>
      </div>

      {/* Floating Blobs */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-[#e8c4c0] opacity-20 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-[#b76e79] opacity-20 mix-blend-multiply filter blur-xl animate-blob"></div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 -mt-8 -ml-8 bg-[#b76e79] opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 -mb-12 -mr-12 bg-[#e8c4c0] opacity-20 rounded-full"></div>

          {/* Animated Lock Icon */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-8 text-[#b76e79]"
          >
            <FaLock className="w-24 h-24 mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#b76e79] mb-6"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Access Restricted
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-8 text-lg leading-relaxed"
          >
            Our beauty sanctuary is exclusive to members. Please authenticate to
            access our premium services and offers.
          </motion.p>

          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-[#e8c4c0] transition-all flex items-center justify-center gap-2"
            >
              <FaArrowRight />
              <span>Continue to Homepage</span>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-sm animate-pulse"
            >
              Redirecting automatically in 5 seconds...
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute bottom-10 right-10 text-[#e8c4c0] text-4xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✦
      </motion.div>
    </div>
  );
}
