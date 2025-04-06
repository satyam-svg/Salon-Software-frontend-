'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheck, FaChevronLeft, FaChevronRight, FaUser, FaStore, FaBoxes, FaClipboardCheck } from 'react-icons/fa';
import StepOne from '@/Components/StepOne';
import StepTwo from '@/Components/Steptwo';
import StepThree from '@/Components/Stepthree';
import StepFour from '@/Components/StepFour';
import StepFive from '@/Components/StepFive';

const CreateSalonForm = () => {
  const [step, setStep] = useState(1);
  

  const steps = [
    { title: 'Basic Info', number: 1, icon: <FaStore />, color: 'from-[#FF9A8B] to-[#FF6B95]' },
    { title: 'Branches', number: 2, icon: <FaPlus />, color: 'from-[#FF6B95] to-[#FF8E53]' },
    { title: 'Staff', number: 3, icon: <FaUser />, color: 'from-[#FF8E53] to-[#FFD166]' },
    { title: 'Inventory', number: 4, icon: <FaBoxes />, color: 'from-[#FFD166] to-[#06D6A0]' },
    { title: 'Review', number: 5, icon: <FaClipboardCheck />, color: 'from-[#06D6A0] to-[#118AB2]' },
  ];

  const calculateProgress = () => ((step - 1) / (steps.length - 1)) * 100;

  const handleNextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };



  return (
    <div className="min-h-screen bg-[#fff9f7] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Tracker */}
        <div className="mb-12 lg:mb-16 px-4 sm:px-8">
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full -z-10" />
            
            <motion.div
              className="absolute top-1/4 left-0 h-2 sm:h-3 rounded-full bg-gradient-to-r from-[#FF9A8B] via-[#FF6B95] via-[#FF8E53] via-[#FFD166] via-[#06D6A0] to-[#118AB2]"
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            <div className="flex justify-between relative">
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center z-10">
                  <motion.button
                    className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg
                      ${step >= s.number ? 
                        `bg-gradient-to-br ${s.color} shadow-md` : 
                        'bg-gray-300'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => step > s.number && setStep(s.number)}
                  >
                    <div className="scale-75 sm:scale-100">
                      {step > s.number ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <FaCheck />
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ 
                            scale: step === s.number ? [1, 1.1, 1] : 1,
                            rotate: step === s.number ? [0, 5, -5, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {s.icon}
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                  
                  <motion.div
                    className="mt-2 sm:mt-3 text-center hidden sm:block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className={`text-xs sm:text-sm font-medium ${step >= s.number ? 'text-gray-800' : 'text-gray-400'}`}>
                      {s.title}
                    </p>
                    <p className={`text-[10px] sm:text-xs ${step >= s.number ? 'text-gray-600' : 'text-gray-400'}`}>
                      Step {s.number}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="sm:hidden mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#b76e79]">
            {steps[step - 1].title}
          </h2>
          <p className="text-gray-500 text-sm">
            Step {step} of {steps.length}
          </p>
        </div>

        {/* Form Content */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden"
          >
            <StepOne 
              step={step} 
              onNextStep={handleNextStep}
            />

            <StepTwo 
              step={step}
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
            />

            <StepThree 
              step={step}
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
            />

            <StepFour 
              step={step}
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
            />

            <StepFive 
              step={step}
              onPreviousStep={handlePreviousStep}
            />

            {/* Navigation Controls */}
            {step !== 1 && step !== 5 && (
              <div className="flex justify-between mt-12">
                <motion.button
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-[#b76e79] hover:text-[#a55d68] font-semibold"
                  onClick={handlePreviousStep}
                >
                  <FaChevronLeft /> Previous
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#b76e79] text-white px-8 py-3 rounded-xl hover:bg-[#a55d68] transition-colors flex items-center gap-2"
                  onClick={handleNextStep}
                >
                  Next <FaChevronRight />
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateSalonForm;