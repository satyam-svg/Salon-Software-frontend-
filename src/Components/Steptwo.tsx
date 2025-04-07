// components/SalonSetup/StepTwo.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiChevronLeft, FiChevronRight, FiClock, FiX } from 'react-icons/fi';

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

export const StepTwo = ({ setStep }: { setStep: (step: number) => void }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
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
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-playfair text-[#b76e79] mb-4"
        >
          Manage Branches
        </motion.h2>
        <p className="text-gray-600">Add multiple branches to your salon network</p>
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
                className="p-4 bg-white rounded-xl shadow-sm border border-[#f0f0f0] flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-[#b76e79]">{branch.name}</h3>
                  <p className="text-sm text-gray-500">{branch.tag}</p>
                </div>
                <button
                  onClick={() => removeBranch(branch.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Form */}
      {(isEditing || branches.length === 0) && (
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-[#f0f0f0]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Name */}
            <div>
              <label className="block text-gray-700 mb-2">Branch Name *</label>
              <input
                {...register('branchName', { required: 'Branch name is required' })}
                className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
              />
              {errors.branchName && (
                <span className="text-red-500 text-sm">{errors.branchName.message}</span>
              )}
            </div>



            {/* Tag */}
            <div>
              <label className="block text-gray-700 mb-2">Tagline</label>
              <input
                {...register('tag')}
                className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
              />
            </div>
             
             {/* location */}
            <div>
              <label className="block text-gray-700 mb-2">Location*</label>
              <input
                {...register('location', { required: 'Locati is required' })}
                className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
              />
              {errors.branchName && (
                <span className="text-red-500 text-sm">{errors.branchName.message}</span>
              )}
            </div>


            {/* Opening Hours */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Opening Time *</label>
                <div className="flex items-center gap-3">
                  <FiClock className="text-[#b76e79]" />
                  <input
                    type="time"
                    {...register('openingTime', { required: 'Opening time is required' })}
                    className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                  />
                </div>
                {errors.openingTime && (
                  <span className="text-red-500 text-sm">{errors.openingTime.message}</span>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Closing Time *</label>
                <div className="flex items-center gap-3">
                  <FiClock className="text-[#b76e79]" />
                  <input
                    type="time"
                    {...register('closingTime', { required: 'Closing time is required' })}
                    className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                  />
                </div>
                {errors.closingTime && (
                  <span className="text-red-500 text-sm">{errors.closingTime.message}</span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  })}
                  className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  {...register('contact', { 
                    required: 'Contact number is required',
                    pattern: { value: /^[0-9]{10}$/, message: '10 digits required' }
                  })}
                  className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                />
                {errors.contact && (
                  <span className="text-red-500 text-sm">{errors.contact.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={() => setIsEditing(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-gray-600 hover:text-[#b76e79] transition-colors"
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white rounded-lg font-semibold"
            >
              {branches.length === 0 ? 'Save Branch' : 'Add Branch'}
            </motion.button>
          </div>
        </motion.form>
      )}

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
            className="flex items-center gap-2 px-6 py-3 bg-[#b76e79] text-white rounded-lg font-semibold"
          >
            <FiPlus className="text-lg" />
            Add New Branch
          </motion.button>
        </motion.div>
      )}

      {/* Navigation Controls */}
      <div className="mt-12 flex justify-between">
        <motion.button
          onClick={() => setStep(1)}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-[#b76e79] hover:text-[#9a5a63]"
        >
          <FiChevronLeft />
          Previous Step
        </motion.button>
        
        <motion.button
          onClick={() => setStep(3)}
          disabled={branches.length === 0}
          whileHover={{ x: 5 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
            branches.length === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white hover:shadow-lg'
          }`}
        >
          Next Step
          <FiChevronRight />
        </motion.button>
      </div>
    </motion.div>
  );
};