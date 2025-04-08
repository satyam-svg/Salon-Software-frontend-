'use client';

import { motion, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { FiCheck, FiInfo, FiUser, FiImage,FiClipboard, FiBox } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { VscSourceControl } from 'react-icons/vsc';
import axios from 'axios';
import { usePathname } from 'next/navigation';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Salon basic information', icon: <FiInfo /> },
  { id: 2, title: 'Branches', description: 'Add your services', icon: <VscSourceControl /> },
  { id: 3, title: 'Staff', description: 'Setup your team', icon: <FiUser /> },
  { id: 4, title: 'Inventory', description: 'Upload photos', icon: <FiBox /> },
  { id: 5, title: 'Review', description: 'Confirm details', icon: <FiClipboard /> },
];

export const ProgressStepper = ({ currentStep,setCurrentStep }: { currentStep: number;setCurrentStep: (step: number) => void}) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  const springProgress = useSpring(progressPercentage, {
    stiffness: 100,
    damping: 20,
  });
  const [, setDisplayValue] = useState(0);
  const pathname = usePathname();
    const userId = pathname.split('/')[1];

  useMotionValueEvent(springProgress, 'change', (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    const checkSalonStatus = async () => {
      try {
        const response = await axios.get(`https://salon-backend-3.onrender.com/api/users/${userId}`);
        const data = response.data;
        setCurrentStep(data.user.step)
        
      } catch (error) {
        console.error('Error checking salon status:', error);
        
      }
    };

    if (userId) {
      checkSalonStatus();
    }
    
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-16 px-4 sm:px-6 lg:px-8" style={{position:'relative',top:'1.2rem'}}>
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1.5 sm:h-2.5 bg-gray-100/80 rounded-full -translate-y-1/2 shadow-inner" />
        
        <motion.div
          className="absolute top-1/2 left-0 h-1.5 sm:h-2.5 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full -translate-y-1/2 shadow-lg shadow-pink-200"
          style={{ 
            width: useTransform(springProgress, (val) => `${val}%`),
          }}
          initial={{ width: '0%' }}
          animate={{ 
            width: `${progressPercentage}%`,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isFirst = index === 0;
            

            return (
              <div 
                key={step.id}
                className="relative flex flex-col items-center w-16 sm:w-24"
              >
                {!isFirst && (
                  <div className="absolute top-[30%] right-full w-[calc(100%-2rem)] sm:w-[calc(100%-2.5rem)] h-1">
                    {/* <motion.div
                      className="h-full bg-pink-500"
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: isCompleted ? 1 : 0,
                        transition: { duration: 0.6 }
                      }}
                    /> */}
                  </div>
                )}

                <motion.div
                  className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold 
                    ${isCompleted ? 'bg-pink-500 text-white' : ''}
                    ${isActive ? 'bg-white border-2 sm:border-4 border-pink-500 sm:scale-125 scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'}
                  `}
                  initial={false}
                  animate={{
                    scale: isActive ? (window.innerWidth < 640 ? 1.1 : 1.25) : 1,
                    backgroundColor: isCompleted ? '#ec4899' : isActive ? '#fff' : '#f3f4f6',
                    borderColor: isActive ? '#ec4899' : 'transparent'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <FiCheck className="w-4 h-4 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`${isActive ? 'text-pink-500' : 'text-gray-400'}`}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  className="absolute top-full mt-4 sm:mt-6 w-32 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className={`text-xs sm:text-sm font-semibold ${
                    isActive || isCompleted ? 'text-pink-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};