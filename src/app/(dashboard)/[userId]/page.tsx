'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCrown, FaBusinessTime } from 'react-icons/fa';
import LoadingSpinner from '@/Components/LoadingSpinner';
import axios from 'axios';

const DashboardPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  

  const [hasSalon, setHasSalon] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [name, setName] = useState("");

  // Extract userId from pathname like /1234 or /5678/anything
  const userId = pathname.split('/')[1];

  useEffect(() => {
    const checkSalonStatus = async () => {
      try {
        const response = await axios.get(`https://salon-backend-3.onrender.com/api/users/${userId}`);
        const data = response.data;
        setName(data.user.fullname);
        
        if (data.user.salonId) {
          setHasSalon(true);
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(timer);
                router.push(`/${userId}/ownerhomepage`);
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          router.push(`/${userId}/salon/not_created`);
        }
      } catch (error) {
        console.error('Error checking salon status:', error);
        router.push('/error');
      }
    };

    if (userId) {
      checkSalonStatus();
    }
  }, [userId, router]);

  if (hasSalon === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f7]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f7] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#e8c4c0] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 left-0 w-96 h-96 bg-[#b76e79] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-8"
          >
            <FaCrown className="text-6xl text-[#b76e79] mx-auto" />
          </motion.div>

          <h1 className="text-4xl font-bold text-[#b76e79] mb-6 font-playfair">
            Welcome, Salon Owner! 👑
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#e8c4c0] rounded-full opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#b76e79] rounded-full opacity-20"></div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Hi, {name}!
              </h2>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <FaBusinessTime className="text-4xl text-[#b76e79] animate-pulse" />
                <span className="text-2xl font-medium text-gray-700">
                  Salon Found! 🎉
                </span>
              </div>

              <motion.div
                className="text-xl text-gray-600 mb-8"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1 }}
              >
                Redirecting in {countdown} seconds...
              </motion.div>

              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mx-auto max-w-xs">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#b76e79] to-[#e8c4c0]"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>

          <p className="text-gray-600 text-sm mt-6">
            Ready to manage your beauty empire? ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;