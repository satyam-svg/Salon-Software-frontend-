// components/SalonSetup/StepTwo.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiChevronLeft, FiChevronRight, FiClock, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface Branch {
  id: string;
  name: string;
  tag: string;
  openingTime: string;
  location: string;
  closingTime: string;
  email: string;
  contact: string;
}

interface FormData {
  branchName: string;
  tag: string;
  location: string;
  openingTime: string;
  closingTime: string;
  email: string;
  contact: string;
}

const floatingVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const StepTwo = ({ setStep }: { setStep: (step: number) => void }) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isValid }, 
    trigger,
    watch 
  } = useForm<FormData>({ mode: 'onChange' });
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = (data: FormData) => {
    const newBranch = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    
    setBranches(prev => [...prev, newBranch]);
    reset();
    setIsEditing(false);
  };

  const removeBranch = (id: string) => {
    setBranches(prev => prev.filter(branch => branch.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-4"
        >
          Manage Branches
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300 text-lg"
        >
          Add multiple branches to your salon network
        </motion.p>
      </div>

      {/* Saved Branches List */}
      <AnimatePresence>
        {branches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 space-y-4"
          >
            {branches.map((branch) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-shadow"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">{branch.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                      {branch.tag}
                    </span>
                    <span>•</span>
                    <span>{branch.location}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => removeBranch(branch.id)}
                  className="text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <FiX className="text-lg" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Form */}
      <AnimatePresence>
        {(isEditing || branches.length === 0) && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Branch Name */}
              <motion.div
                variants={floatingVariants}
                className="relative z-0"
              >
                <input
                  {...register('branchName', { 
                    required: 'Branch name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters' }
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Branch Name *
                </label>
                <div className="absolute right-4 top-5">
                  <AnimatePresence>
                    {errors.branchName ? (
                      <FiAlertCircle className="text-rose-500" />
                    ) : watch('branchName') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <FiCheckCircle className="text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.branchName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.branchName.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Tag */}
              <motion.div
                variants={floatingVariants}
                className="relative z-0"
              >
                <input
                  {...register('tag')}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Tagline (Optional)
                </label>
              </motion.div>

              {/* Location */}
              <motion.div
                variants={floatingVariants}
                className="relative z-0"
              >
                <input
                  {...register('location', { required: 'Location is required' })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Location *
                </label>
                {errors.location && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.location.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Opening Hours */}
              <div className="space-y-6">
                <motion.div
                  variants={floatingVariants}
                  className="relative z-0"
                >
                  <div className="flex items-center gap-3">
                    <FiClock className="text-emerald-500" />
                    <input
                      type="time"
                      {...register('openingTime', { required: 'Opening time is required' })}
                      className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                    />
                  </div>
                  <label className="absolute top-4 left-10 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Opening Time *
                  </label>
                  {errors.openingTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-rose-500"
                    >
                      {errors.openingTime.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  className="relative z-0"
                >
                  <div className="flex items-center gap-3">
                    <FiClock className="text-emerald-500" />
                    <input
                      type="time"
                      {...register('closingTime', { required: 'Closing time is required' })}
                      className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                    />
                  </div>
                  <label className="absolute top-4 left-10 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Closing Time *
                  </label>
                  {errors.closingTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-rose-500"
                    >
                      {errors.closingTime.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Contact Info */}
              <motion.div
                variants={floatingVariants}
                className="relative z-0"
              >
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Email Address *
                </label>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                variants={floatingVariants}
                className="relative z-0"
              >
                <input
                  type="tel"
                  {...register('contact', { 
                    required: 'Contact number is required',
                    pattern: { value: /^[0-9]{10}$/, message: '10 digits required' }
                  })}
                  className="block w-full pt-5 pb-2 px-4 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
                  placeholder=" "
                />
                <label className="absolute top-4 left-4 text-gray-400 duration-300 transform -translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Contact Number *
                </label>
                {errors.contact && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-rose-500"
                  >
                    {errors.contact.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              {branches.length > 0 && (
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-gray-600 hover:text-rose-500 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!isValid}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {branches.length === 0 ? 'Save Branch' : 'Add Branch'}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Add New Branch Button */}
      {!isEditing && branches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            Add New Branch
          </motion.button>
        </motion.div>
      )}

      {/* Navigation Controls */}
      <motion.div
        className="mt-12 flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          onClick={() => setStep(1)}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
        >
          <FiChevronLeft />
          Previous Step
        </motion.button>
        
        <motion.button
          onClick={() => setStep(3)}
          disabled={branches.length === 0}
          whileHover={{ x: 5 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
            branches.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
          }`}
        >
          Next Step
          <FiChevronRight />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};