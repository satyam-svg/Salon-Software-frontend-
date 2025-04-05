// components/LoadingScreen.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const LoadingScreen = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
      >
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
          
          .loading-text {
            background: linear-gradient(90deg, #b76e79, #d4a373);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        `}</style>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 10,
            delay: 0.2
          }}
          className="relative w-32 h-32 mb-8"
        >
          <Image
            src="/logo.png"
            alt="SalonSphere Logo"
            fill
            className="object-contain"
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full border-4 border-[#b76e79] border-t-transparent"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold loading-text mb-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          SalonSphere
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 mb-8"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Creating your perfect salon experience
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="h-1 bg-gradient-to-r from-[#b76e79] to-[#d4a373] rounded-full max-w-xs"
        />

        <motion.div 
          className="absolute bottom-8 right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            className="text-xs text-gray-400"
          >
            Loading your beauty journey...
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;