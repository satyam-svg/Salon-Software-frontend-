'use client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiClock, FiUploadCloud, FiX, FiScissors, FiMail, FiSmartphone, FiAlertTriangle } from 'react-icons/fi';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-[100%] md:max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-2xl relative overflow-hidden border border-[#f0f0f0]"
    >
      {/* Floating Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD9E8] rounded-full opacity-20 mix-blend-multiply blur-xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#D1E0FF] rounded-full opacity-20 mix-blend-multiply blur-xl" />

      {/* Form Header */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-10 text-center relative z-10"
      >
        <motion.div
          whileHover={{ rotate: -15, scale: 1.1 }}
          className="inline-block p-5 bg-[#FFE5EF] rounded-2xl mb-6 shadow-lg"
        >
          <FiScissors className="text-4xl text-[#FF6B9B]" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FF6B9B] to-[#FF8E53] bg-clip-text text-transparent">
          Create Your Salon
        </h1>
        <p className="text-gray-500 text-sm">Craft your unique beauty space</p>
      </motion.div>

      <div className="space-y-7 relative z-10">
        {/* Salon Name */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative group">
            <input
              {...register('salon_name', { required: 'Salon name is required' })}
              className="w-full px-5 py-4 text-gray-700 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#FF6B9B] focus:ring-2 focus:ring-[#FF6B9B]/20 transition-all duration-300 peer"
              placeholder=" "
            />
            <label className="floating-label">Salon Name</label>
            {errors.salon_name && <FormError message={errors.salon_name.message} />}
          </div>
        </motion.div>

        {/* Salon Tagline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="relative group">
            <textarea
              {...register('salon_tag', { 
                required: 'Tagline is required',
                maxLength: 50 
              })}
              className="w-full px-5 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#FF6B9B] focus:ring-2 focus:ring-[#FF6B9B]/20 transition-all duration-300 peer h-32"
              placeholder=" "
            />
            <label className="floating-label">Creative Tagline</label>
            <div className="absolute right-4 bottom-4 text-sm text-gray-400">
              {watch('salon_tag')?.length || 0}/50
            </div>
            {errors.salon_tag && <FormError message={errors.salon_tag.message} />}
          </div>
        </motion.div>

        {/* Opening Time */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="relative group">
            <div className="flex items-center gap-3">
              <FiClock className="text-[#FF6B9B] ml-3" />
              <input
                type="time"
                {...register('opening_time', { required: 'Opening time is required' })}
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#FF6B9B] focus:ring-2 focus:ring-[#FF6B9B]/20 transition-all duration-300"
              />
            </div>
            {errors.opening_time && <FormError message={errors.opening_time.message} />}
          </div>
        </motion.div>

        {/* Contact Information Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Email */}
          <div className="relative group">
            <div className="flex items-center gap-3">
              <FiMail className="text-[#FF6B9B] ml-3" />
              <input
                type="email"
                {...register('contact_email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#FF6B9B] focus:ring-2 focus:ring-[#FF6B9B]/20 transition-all duration-300"
                placeholder=" "
              />
            </div>
            <label className="floating-label-left">Contact Email</label>
            {errors.contact_email && <FormError message={errors.contact_email.message} />}
          </div>

          {/* Phone */}
          <div className="relative group">
            <div className="flex items-center gap-3">
              <FiSmartphone className="text-[#FF6B9B] ml-3" />
              <input
                type="tel"
                {...register('contact_number', { 
                  required: 'Phone required',
                  pattern: { value: /^[0-9]{10}$/, message: '10 digits required' }
                })}
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#FF6B9B] focus:ring-2 focus:ring-[#FF6B9B]/20 transition-all duration-300"
                placeholder=" "
              />
            </div>
            <label className="floating-label-left">Contact Number</label>
            {errors.contact_number && <FormError message={errors.contact_number.message} />}
          </div>
        </motion.div>

        {/* Image Upload */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            {...getRootProps()}
            className={`relative h-64 rounded-2xl border-3 border-dashed transition-all
              ${preview ? 'border-[#FF6B9B]' : 'border-gray-200 hover:border-[#FF6B9B]'}
              bg-gradient-to-br from-[#FFFAFC] to-[#FFF5F9] cursor-pointer group`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <>
                <motion.img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                >
                  <FiX className="text-red-500 text-lg" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4"
                >
                  <FiUploadCloud className="text-4xl text-[#FF6B9B] opacity-80" />
                </motion.div>
                <p className="text-gray-600 font-medium mb-1">Drag & drop salon image</p>
                <p className="text-sm text-gray-400">or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">(JPEG, PNG, max 5MB)</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-8 py-5 bg-gradient-to-r from-[#FF6B9B] to-[#FF8E53] text-white rounded-xl font-semibold 
                    shadow-lg hover:shadow-[#FF6B9B]/30 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Creating Salon...
            </span>
          ) : (
            'Create Salon'
          )}
        </motion.button>

        {/* Error Messages */}
        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3"
          >
            <FiAlertTriangle className="flex-shrink-0" />
            {submissionError}
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .floating-label {
          position: absolute;
          left: 1.25rem;
          top: 1rem;
          font-size: 0.9rem;
          color: #999;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(to bottom, transparent 50%, #f8fafc 50%);
          padding: 0 0.5rem;
        }

        .floating-label-left {
          left: 3.5rem;
        }

        input:focus ~ .floating-label,
        input:not(:placeholder-shown) ~ .floating-label,
        textarea:focus ~ .floating-label,
        textarea:not(:placeholder-shown) ~ .floating-label {
          top: -0.6rem;
          left: 1rem;
          font-size: 0.75rem;
          color: #FF6B9B;
          background: #f8fafc;
        }

        .floating-label-left:not(:placeholder-shown) {
          left: 3rem;
        }
      `}</style>
    </motion.form>
  );
}


const FormError = ({ message }: { message?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 flex items-center gap-1"
  >
    <FiAlertTriangle className="flex-shrink-0" />
    <span className="text-sm">{message}</span>
  </motion.div>
);