"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiShare2, FiCopy, FiCheck, FiStar, FiSettings } from "react-icons/fi";
import { useState, useEffect } from "react";
import Image from "next/image";

const floatingStars = Array(30).fill(null);

const OwnerHomepage = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [daysOperating, setDaysOperating] = useState(0);
  const [yearsOperating, setYearsOperating] = useState(0);

  const salonData = {
    opening_time: "2025-04-23",
    share_link: "fgfdfgfdfgfdfgfdfgfdf.com",
    salon_img:
      "https://res.cloudinary.com/dl1lqotns/image/upload/v1744206969/hiz45i9z72s7vxgfb9dq.jpg",
    salon_name: "Fabulas salon",
    salon_tagline: "Discover your best form",
    total_customers: 1500,
    total_staff: 12,
    total_services: 45,
  };

  useEffect(() => {
    const openedDate = new Date(salonData.opening_time);
    const today = new Date();
    const diffTime = Math.abs(today - openedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = today.getFullYear() - openedDate.getFullYear();

    setDaysOperating(diffDays);
    setYearsOperating(diffYears);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(salonData.share_link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingStars.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-200"
            initial={{
              scale: 0,
              opacity: 0,
              x: Math.random() * 1000,
              y: Math.random() * 1000,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FiStar />
          </motion.div>
        ))}
      </div>

      {/* Main Content Container */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12 relative z-10 grid gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Animated Salon Image */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative w-72 h-72 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <Image
              src={salonData.salon_img}
              alt={salonData.salon_name}
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-pink-900/20"
            />
          </motion.div>

          {/* Salon Info */}
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="flex-1 space-y-6"
          >
            <motion.h1
              className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {salonData.salon_name.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="text-2xl text-gray-600 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {salonData.salon_tagline}
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center bg-white px-8 py-4 rounded-full shadow-lg relative overflow-hidden"
            >
              <FiStar className="text-yellow-400 mr-2 text-xl z-10" />
              <span className="font-medium z-10">
                Celebrating {yearsOperating}+ Years of Excellence
              </span>
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="absolute inset-0 bg-purple-100 rounded-full"
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {[
            { value: daysOperating, label: "Days Operating", color: "purple" },
            {
              value: salonData.total_customers,
              label: "Happy Customers",
              color: "pink",
            },
            {
              value: salonData.total_staff,
              label: "Expert Staff",
              color: "purple",
            },
            {
              value: salonData.total_services,
              label: "Services Offered",
              color: "pink",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-3xl shadow-2xl bg-white relative overflow-hidden border-l-8 border-${stat.color}-500`}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`text-5xl font-bold text-${stat.color}-600 mb-4`}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stat.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    {stat.value}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-gray-500 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Share Section */}
        <motion.div
          className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
        >
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex-1 text-white">
              <h2 className="text-3xl font-bold mb-2">Your Salon Link</h2>
              <p className="opacity-90 text-lg">
                Share this magical link with your customers
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm flex-1 relative overflow-hidden">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={salonData.share_link}
                    readOnly
                    className="bg-transparent text-white flex-1 min-w-0 text-lg font-mono"
                  />
                  <motion.button
                    onClick={copyToClipboard}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-purple-200 transition-colors"
                  >
                    <AnimatePresence mode="wait">
                      {copySuccess ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <FiCheck className="text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <FiCopy />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 15 }}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-xl text-white transition-all"
              >
                <FiShare2 className="text-2xl" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard CTA */}
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 mx-auto relative overflow-hidden"
          >
            <FiSettings className="text-2xl animate-spin-slow" />
            <span>Manage Your Salon Dashboard</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Background Effects */}
      <motion.div
        className="fixed inset-0 pointer-events-none -z-10"
        animate={{
          background: [
            "linear-gradient(45deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
            "linear-gradient(135deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
            "linear-gradient(225deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
            "linear-gradient(315deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default OwnerHomepage;
