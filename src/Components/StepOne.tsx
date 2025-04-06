'use client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiClock, FiUploadCloud, FiX, FiScissors, FiSmartphone, FiMail } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect, useMemo } from 'react';
import { defaultColors, ColorTheme } from '../../theme';
import { staggerItems, fadeInUp, scaleUp, slideIn } from '../../animation';

interface FormData {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  salon_img: File | string | null;
}

interface StepOneProps {
  setFormData: (data: FormData) => void;
  formData: Partial<FormData>;
  colors?: Partial<ColorTheme>;
}

export default function StepOne({ setFormData, formData = {}, colors = {} }: StepOneProps) {
  const mergedColors = useMemo(() => ({ ...defaultColors, ...colors }), [colors]);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData) {
      const fields = ['salon_name', 'salon_tag', 'opening_time', 'contact_email', 'contact_number'];
      fields.forEach(field => {
        if (formData[field as keyof FormData]) {
          setValue(field as keyof FormData, formData[field as keyof FormData]!);
        }
      });

      if (formData.salon_img) {
        if (typeof formData.salon_img === 'string') {
          setPreview(formData.salon_img);
        } else if (formData.salon_img instanceof File) {
          setPreview(URL.createObjectURL(formData.salon_img));
        }
      }
    }
  }, [formData, setValue]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue('salon_img', file);
        setFormData({ ...formData, salon_img: file });
        setPreview(URL.createObjectURL(file));
      }
    }
  });

  const onSubmit = (data: FormData) => {
    setFormData({ ...formData, ...data });
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setValue('salon_img', null);
    setFormData({ ...formData, salon_img: null });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[95%] md:max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl relative overflow-hidden"
      style={{ '--primary': mergedColors.primary, '--secondary': mergedColors.secondary } as React.CSSProperties}
    >
      {/* Animated Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-32 -right-32 w-64 h-64 bg-[color:var(--primary)]/10 rounded-full mix-blend-multiply"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -bottom-48 -left-48 w-96 h-96 bg-[color:var(--secondary)]/10 rounded-full mix-blend-multiply"
      />

      {/* Form Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8 md:mb-12 text-center relative z-10"
      >
        <motion.div
          initial={{ rotate: -45, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          className="inline-block p-4 md:p-6 rounded-2xl bg-[color:var(--primary)]/10 mb-4 md:mb-6"
        >
          <FiScissors className="text-3xl md:text-4xl" style={{ color: mergedColors.primary }} />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          Create Your Salon
        </h1>
        <p className="text-sm md:text-base text-gray-500">Craft your unique salon identity</p>
      </motion.div>

      <motion.div
        variants={staggerItems}
        initial="hidden"
        animate="visible"
        className="space-y-6 md:space-y-8 relative z-10"
      >
        {/* Salon Name */}
        <motion.div variants={staggerItems} custom={0} className="relative">
          <input
            {...register('salon_name', { required: 'Salon name is required' })}
            className={`w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg bg-gray-50 rounded-xl border-2 focus:border-[color:var(--primary)] focus:ring-0 peer transition-colors ${
              errors.salon_name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder=" "
            autoFocus
          />
          <label className="floating-label">
            {errors.salon_name ? '❗ Salon Name' : '✨ Salon Name'}
          </label>
        </motion.div>

        {/* Salon Tagline */}
        <motion.div variants={staggerItems} custom={1} className="relative">
          <textarea
            {...register('salon_tag', { 
              required: 'Tagline is required',
              maxLength: { value: 50, message: 'Max 50 characters' }
            })}
            className={`w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl border-2 focus:border-[color:var(--primary)] focus:ring-0 peer resize-none transition-colors ${
              errors.salon_tag ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder=" "
            rows={2}
          />
          <label className="floating-label">🌟 Creative Tagline</label>
          <div className="absolute right-4 bottom-3 text-sm text-gray-400">
            {formData?.salon_tag?.length || 0}/50
          </div>
        </motion.div>

        {/* Opening Time */}
        <motion.div variants={staggerItems} custom={2} className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="relative col-span-2">
            <motion.div
              variants={slideIn}
              custom={0}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2"
            >
              <FiClock className="text-gray-400" />
            </motion.div>
            <input
              type="time"
              {...register('opening_time', { required: 'Opening time is required' })}
              className={`w-full px-4 md:px-6 py-3 md:py-4 pl-12 md:pl-16 bg-gray-50 rounded-xl border-2 transition-colors ${
                errors.opening_time ? 'border-red-300' : 'border-gray-200'
              } focus:border-[color:var(--primary)]`}
            />
            <label className="floating-label">⏰ Opening Hours</label>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={staggerItems} custom={3} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative">
            <motion.div
              variants={slideIn}
              custom={0}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2"
            >
              
            </motion.div>
            <input
              type="email"
              {...register('contact_email', {
                required: 'Email required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              className={`w-full px-4 md:px-6 py-3 md:py-4 pl-12 md:pl-16 bg-gray-50 rounded-xl border-2 transition-colors ${
                errors.contact_email ? 'border-red-300' : 'border-gray-200'
              } focus:border-[color:var(--primary)]`}
              placeholder=" "
              inputMode="email"
            />
            <label className="floating-label">📧 Email Address</label>
          </div>

          <div className="relative">
            <motion.div
              variants={slideIn}
              custom={1}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2"
            >
              
            </motion.div>
            <input
              type="tel"
              {...register('contact_number', {
                required: 'Phone required',
                pattern: { value: /^[0-9]{10}$/, message: '10 digits required' }
              })}
              className={`w-full px-4 md:px-6 py-3 md:py-4 pl-12 md:pl-16 bg-gray-50 rounded-xl border-2 transition-colors ${
                errors.contact_number ? 'border-red-300' : 'border-gray-200'
              } focus:border-[color:var(--primary)]`}
              placeholder=" "
              inputMode="tel"
            />
            <label className="floating-label">📱 Phone Number</label>
          </div>
        </motion.div>

        {/* Image Upload */}
        <motion.div variants={staggerItems} custom={4} className="space-y-4">
          <label className="block text-sm md:text-base font-medium text-gray-600">
            📸 Salon Image <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className={`group relative h-56 md:h-64 rounded-2xl border-4 border-dashed transition-all
              ${preview ? 'border-[color:var(--primary)]' : 'border-gray-200 hover:border-[color:var(--primary)]'}
              ${errors.salon_img ? 'border-red-300' : ''}`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center bg-gradient-to-br from-white/50 to-[color:var(--primary)]/5">
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
                    className="absolute top-2 md:top-4 right-2 md:right-4 p-1.5 md:p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <FiX className="text-red-500 text-lg md:text-xl" />
                  </button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="p-3 md:p-4 rounded-full bg-[color:var(--primary)]/10 mb-2 md:mb-4"
                  >
                    <FiUploadCloud className="text-3xl md:text-4xl" style={{ color: mergedColors.primary }} />
                  </motion.div>
                  <p className="text-sm md:text-base text-gray-600 font-medium mb-1 md:mb-2">
                    Drag & drop your salon photo
                  </p>
                  <p className="text-xs md:text-sm text-gray-400">
                    (JPEG, PNG, max 5MB)
                  </p>
                </>
              )}
            </div>
            <input {...getInputProps()} />
          </div>
        </motion.div>
      </motion.div>

      {/* Error Messages */}
      <div className="mt-6 md:mt-8 space-y-2">
        {Object.values(errors).map((error, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 md:p-4 bg-red-50 text-red-600 rounded-xl flex items-center text-sm md:text-base"
          >
            <FiX className="mr-2 flex-shrink-0" />
            {error?.message}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .floating-label {
          position: absolute;
          left: 1rem;
          top: 0.75rem;
          font-size: 0.875rem;
          color: ${mergedColors.text}80;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          background: linear-gradient(to bottom, transparent 50%, white 50%);
          padding: 0 0.5rem;
        }
        
        input:focus ~ .floating-label,
        input:not(:placeholder-shown) ~ .floating-label,
        textarea:focus ~ .floating-label,
        textarea:not(:placeholder-shown) ~ .floating-label {
          top: -0.75rem;
          left: 0.75rem;
          font-size: 0.75rem;
          color: ${mergedColors.primary};
          background: white;
          padding: 0 0.25rem;
        }

        @media (max-width: 640px) {
          .floating-label {
            font-size: 0.75rem;
            top: 0.5rem;
            left: 0.75rem;
          }
        }
      `}</style>
    </motion.form>
  );
}