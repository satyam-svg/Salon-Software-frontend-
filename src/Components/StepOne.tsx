// components/SalonSetup/StepOne.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX, FiAlertTriangle } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

interface FormData {
  salonName: string;
  tagline: string;
  openingDate: string; // Changed from openingTime to openingDate
  email: string;
  phone: string;
  salonImg: File | null;
}

export const StepOne = ({ setStep }: { setStep: (step: number) => void }) => {
  const pathname = usePathname();
  const userId = pathname.split('/')[1];
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch 
  } = useForm<FormData>();
  
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setValue('salonImg', acceptedFiles[0]);
    }
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setValue('salonImg', null);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (!data.salonImg) throw new Error('Salon image is required');

      // Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', data.salonImg);
      cloudinaryFormData.append('upload_preset', 'salon_preset');

      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dl1lqotns/image/upload',
        { method: 'POST', body: cloudinaryFormData }
      );

      if (!cloudinaryResponse.ok) throw new Error('Image upload failed');
      const cloudinaryData = await cloudinaryResponse.json();

      // Prepare salon data
      const salonData = {
        salon_name: data.salonName,
        salon_tag: data.tagline,
        opening_time: data.openingDate, // Changed from openingTime to openingDate
        contact_email: data.email,
        contact_number: data.phone,
        salon_img_url: cloudinaryData.secure_url,
        user_id: userId
      };

      // Submit to backend
      const response = await fetch('https://salon-backend-3.onrender.com/api/salon/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salonData),
      });

      if (!response.ok) throw new Error('Salon creation failed');
      
      setStep(2); // Move to next step on success

    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmissionError(error.message || 'An error occurred. Please try again.');
      } else {
        // Fallback for unknown error types (e.g., if error is not an instance of Error)
        setSubmissionError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview effect
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.salonImg instanceof File) {
        setPreview(URL.createObjectURL(value.salonImg));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <h2 className="text-3xl font-playfair text-[#b76e79] text-center mb-8">
        Salon Basic Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Salon Name */}
        <div>
          <label className="block text-gray-700 mb-2">Salon Name *</label>
          <input
            {...register('salonName', { required: 'Salon name is required' })}
            className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
          />
          {errors.salonName && (
            <span className="text-red-500 text-sm flex items-center mt-1">
              <FiAlertTriangle className="mr-1" /> {errors.salonName.message}
            </span>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-gray-700 mb-2">Tagline</label>
          <input
            {...register('tagline')}
            className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
          />
        </div>

        {/* Opening Date */} {/* Changed this from Opening Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Opening Date *</label>
            <input
              type="date" // Changed to type="date"
              {...register('openingDate', { required: 'Opening date is required' })} // Changed from openingTime to openingDate
              className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
            />
            {errors.openingDate && ( // Changed from openingTime to openingDate
              <span className="text-red-500 text-sm flex items-center mt-1">
                <FiAlertTriangle className="mr-1" /> {errors.openingDate.message} {/* Changed from openingTime to openingDate */}
              </span>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <span className="text-red-500 text-sm flex items-center mt-1">
                <FiAlertTriangle className="mr-1" /> {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: { value: /^[0-9]{10}$/, message: '10 digits required' }
              })}
              className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm flex items-center mt-1">
                <FiAlertTriangle className="mr-1" /> {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2">Salon Photo *</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-[#e8c4c0] rounded-lg p-8 text-center cursor-pointer hover:border-[#b76e79] transition-colors"
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Salon preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                >
                  <FiX className="text-red-500 text-lg" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <FiUploadCloud className="text-3xl mx-auto text-[#b76e79]" />
                <p className="text-gray-600 font-medium">Drag & drop salon photo</p>
                <p className="text-sm text-gray-400">or click to select (JPEG/PNG)</p>
              </div>
            )}
          </div>
          {errors.salonImg && (
            <span className="text-red-500 text-sm flex items-center mt-1">
              <FiAlertTriangle className="mr-1" /> {errors.salonImg.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white py-4 rounded-lg font-semibold disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Saving...
            </span>
          ) : (
            'Save & Continue'
          )}
        </motion.button>

        {/* Error Message */}
        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
          >
            <FiAlertTriangle />
            {submissionError}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};
