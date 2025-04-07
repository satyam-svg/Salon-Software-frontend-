'use client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiClock, FiUploadCloud, FiX, FiScissors, FiMail, FiSmartphone } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface FormData {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  salon_img: File | null;
}

export default function StepOne() {
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

  const salonImg = watch('salon_img');

  useEffect(() => {
    if (salonImg instanceof File) {
      setPreview(URL.createObjectURL(salonImg));
    }
  }, [salonImg]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setValue('salon_img', acceptedFiles[0]);
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (!data.salon_img) throw new Error('Salon image is required');

      // Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', data.salon_img);
      cloudinaryFormData.append('upload_preset', 'salon_preset');

      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dl1lqotns/image/upload',
        { method: 'POST', body: cloudinaryFormData }
      );

      if (!cloudinaryResponse.ok) throw new Error('Image upload failed');
      const cloudinaryData = await cloudinaryResponse.json();

      // Prepare salon data
      const salonData = {
        salon_name: data.salon_name,
        salon_tag: data.salon_tag,
        opening_time: data.opening_time,
        contact_email: data.contact_email,
        contact_number: data.contact_number,
        salon_img_url: cloudinaryData.secure_url,
        user_id: userId
      };

      // Submit to backend
      const response = await fetch('https://salon-backend-3.onrender.com/api/salon/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Salon creation failed');
      }

      // Handle success
      const result = await response.json();
      console.log('Salon created:', result);
      // Add success redirect/notification here

    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmissionError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setValue('salon_img', null);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[95%] md:max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl relative overflow-hidden"
    >
      {/* Form Header */}
      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-block p-4 md:p-6 rounded-2xl bg-blue-100 mb-4 md:mb-6">
          <FiScissors className="text-3xl md:text-4xl text-blue-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
          Create Your Salon
        </h1>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Salon Name */}
        <div className="relative">
          <input
            {...register('salon_name', { required: 'Salon name is required' })}
            className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${
              errors.salon_name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Salon Name"
          />
          {errors.salon_name && (
            <p className="text-red-500 text-sm mt-1">{errors.salon_name.message}</p>
          )}
        </div>

        {/* Salon Tagline */}
        <div className="relative">
          <textarea
            {...register('salon_tag', { 
              required: 'Tagline is required',
              maxLength: 50 
            })}
            className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${
              errors.salon_tag ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Tagline (max 50 characters)"
          />
          {errors.salon_tag && (
            <p className="text-red-500 text-sm mt-1">{errors.salon_tag.message}</p>
          )}
        </div>

        {/* Opening Time */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" />
            <input
              type="time"
              {...register('opening_time', { required: 'Opening time is required' })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${
                errors.opening_time ? 'border-red-300' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.opening_time && (
            <p className="text-red-500 text-sm mt-1">{errors.opening_time.message}</p>
          )}
        </div>

        {/* Contact Email */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              {...register('contact_email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${
                errors.contact_email ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Contact Email"
            />
          </div>
          {errors.contact_email && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <FiSmartphone className="text-gray-400" />
            <input
              type="tel"
              {...register('contact_number', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Invalid phone number (10 digits required)'
                }
              })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${
                errors.contact_number ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Contact Number"
            />
          </div>
          {errors.contact_number && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_number.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div
          {...getRootProps()}
          className="relative h-56 md:h-64 rounded-2xl border-4 border-dashed border-gray-200 cursor-pointer"
        >
          <input {...getInputProps()} />
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-lg"
              >
                <FiX className="text-red-500" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <FiUploadCloud className="text-3xl text-gray-400 mb-4" />
              <p className="text-gray-600">Drag & drop salon image</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? 'Creating Salon...' : 'Create Salon'}
        </button>

        {/* Error Messages */}
        {submissionError && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl">
            {submissionError}
          </div>
        )}
      </div>
    </motion.form>
  );
}