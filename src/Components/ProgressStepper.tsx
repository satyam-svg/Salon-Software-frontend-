// components/SalonSetup/ProgressStepper.tsx
'use client';

import { motion } from 'framer-motion';

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Services' },
  { id: 3, title: 'Stylists' },
  { id: 4, title: 'Gallery' },
  { id: 5, title: 'Review' },
];

export const ProgressStepper = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2" />
        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold 
                ${currentStep >= step.id ? 'bg-[#b76e79] text-white' : 'bg-gray-100 text-gray-400'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: index * 0.1 }}
            >
              {step.id}
            </motion.div>
            <motion.span
              className={`mt-2 text-sm ${currentStep >= step.id ? 'text-[#b76e79]' : 'text-gray-400'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {step.title}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
};