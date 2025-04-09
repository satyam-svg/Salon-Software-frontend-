"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCopy, FiCheck, FiClock, FiStar, FiSettings } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const OwnerHomepage = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [daysOperating, setDaysOperating] = useState(0);
  const [yearsOperating, setYearsOperating] = useState(0);
 const  salonData = {
    opening_time:"2025-04-23",
    share_link:"fgfdfgfdfgfdfgfdfgfdf.com",
    salon_img:"https://res.cloudinary.com/dl1lqotns/image/upload/v1744206969/hiz45i9z72s7vxgfb9dq.jpg",
    salon_name:"Fabulas salon",
    salon_tagline:"Dicover your best form"
  }
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50/20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Salon Image Container */}
          <motion.div 
            whileHover={{ rotate: 2 }}
            className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-br from-purple-100 to-pink-100"
          >
            <Image
              src={salonData.salon_img}
              alt={salonData.salon_name}
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-pink-900/10" />
          </motion.div>

          {/* Salon Info */}
          <div className="flex-1 space-y-4">
            <motion.h1 
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
            >
              {salonData.salon_name}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-gray-600"
            >
              {salonData.salon_tagline}
            </motion.p>

            {/* Anniversary Badge */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-lg"
            >
              <FiStar className="text-yellow-400 mr-2 text-xl" />
              <span className="font-medium">
                Celebrating {yearsOperating}+ Years of Excellence
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-50">
          <div className="text-4xl font-bold text-purple-600">{daysOperating}</div>
          <div className="text-gray-500">Days Operating</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-50">
          <div className="text-4xl font-bold text-pink-600">{salonData.total_customers}+</div>
          <div className="text-gray-500">Happy Customers</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-50">
          <div className="text-4xl font-bold text-purple-600">{salonData.total_staff}</div>
          <div className="text-gray-500">Expert Staff</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-50">
          <div className="text-4xl font-bold text-pink-600">{salonData.total_services}</div>
          <div className="text-gray-500">Services Offered</div>
        </div>
      </motion.div>

      {/* Share Section */}
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold mb-2">Your Salon Link</h2>
              <p className="opacity-90">Share this link with customers to book appointments</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="bg-white/10 p-3 rounded-xl flex-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={salonData.share_link}
                    readOnly
                    className="bg-transparent text-white flex-1 min-w-0"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="text-white hover:text-purple-200 transition-colors"
                  >
                    {copySuccess ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl text-white transition-colors">
                <FiShare2 className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
        >
          <FiSettings className="text-xl" />
          Manage Your Salon Dashboard
        </motion.button>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-20 left-20 w-48 h-48 bg-purple-100 rounded-full opacity-20 blur-3xl"
        />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-pink-100 rounded-full opacity-20 blur-3xl"
        />
      </div>
    </div>
  );
};

export default OwnerHomepage;