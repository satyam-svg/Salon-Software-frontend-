'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useCycle } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import StepOne from "@/Components/StepOne";
import StepTwo from "@/Components/Steptwo";
import StepThree from "@/Components/Stepthree";
import StepFour from "@/Components/StepFour";
import StepFive from "@/Components/StepFive";

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Branches" },
  { id: 3, title: "Staff" },
  { id: 4, title: "Inventory" },
  { id: 5, title: "Review" },
];



export default function CreatingSalon() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [floatY, cycleFloat] = useCycle(0, -10);
  


  const handleNext = () => {
    setDirection('right');
    if (currentStep < steps.length) setCurrentStep(prev => prev + 1);
    cycleFloat();
  };
  const handlePrev = () => {
    setDirection('left');
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    cycleFloat();
  };
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f7] to-[#f5e6e3] py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#e8c4c0] rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 80, 0],
            y: [0, -80, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-0 w-96 h-96 bg-[#b76e79] rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#d8a8a3] rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            x: [-50, 50, -50],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex justify-between items-center relative">
            <motion.div
              className="absolute top-1/3 left-0 h-2 bg-gray-200/50 w-full -z-10 rounded-full px-2"
              initial={{ width: '100%' }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#b76e79] to-[#d8a8a3] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                className="flex flex-col items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white 
                    ${currentStep >= step.id ? 'bg-[#b76e79]' : 'bg-gray-300'}
                    shadow-lg relative`}
                  whileHover={{ scale: currentStep >= step.id ? 1.1 : 1 }}
                  animate={{
                    scale: currentStep === step.id ? [1, 1.1, 1] : 1,
                    transition: currentStep === step.id ? { repeat: Infinity, duration: 2 } : {}
                  }}
                >
                  {currentStep > step.id ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <FiCheck className="text-xl" />
                    </motion.div>
                  ) : (
                    <motion.span 
                      className="font-medium"
                      animate={{ color: currentStep === step.id ? '#fff' : '#fff' }}
                    >
                      {step.id}
                    </motion.span>
                  )}
                  {currentStep === step.id && (
                    <motion.div
                      className="absolute inset-0 border-2 border-[#b76e79] rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </motion.div>
                <motion.span 
                  className={`mt-3 text-sm font-semibold ${
                    currentStep >= step.id 
                      ? 'text-[#b76e79]' 
                      : 'text-gray-400'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {step.title}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
          animate={{ y: floatY }}
          transition={{ 
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }
          }}
        >
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ 
                opacity: 0, 
                x: direction === 'right' ? 100 : -100,
                y: direction === 'right' ? 20 : -20 
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: 0,
                transition: { type: 'spring', stiffness: 100 }
              }}
              exit={{ 
                opacity: 0, 
                x: direction === 'right' ? -100 : 100,
                y: direction === 'right' ? -20 : 20,
                transition: { duration: 0.3 }
              }}
            >
              {currentStep === 1 && <StepOne />}
              {currentStep === 2 && <StepTwo />}
              {currentStep === 3 && <StepThree />}
              {currentStep === 4 && <StepFour />}
              {currentStep === 5 && <StepFive 
               
              />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-12">
            {currentStep > 1 && (
              <motion.button
                onClick={handlePrev}
                className="flex items-center gap-2 text-[#b76e79] hover:text-[#a55d68] font-semibold px-8 py-3 rounded-xl"
                whileHover={{ 
                  x: -5,
                  scale: 1.05,
                  boxShadow: '0 5px 15px rgba(183,110,121,0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FiChevronLeft className="text-xl" />
                </motion.div>
                Previous
              </motion.button>
            )}
            
            <div className="flex-grow" />
            
            <motion.button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#b76e79] to-[#d8a8a3] text-white px-8 py-3 rounded-xl 
                hover:shadow-lg relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 5px 15px rgba(183,110,121,0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === steps.length ? (
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Submit
                </motion.span>
              ) : (
                <>
                  Next 
                  <motion.div
                    className="inline-block ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    
                  </motion.div>
                </>
              )}
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}