// components/LoadingSpinner.tsx
'use client';

import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    className="w-16 h-16 rounded-full border-4 border-[#b76e79] border-t-transparent"
  />
);

export default LoadingSpinner;