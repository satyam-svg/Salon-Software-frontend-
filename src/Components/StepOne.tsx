'use client'
import { useState } from 'react';
import { FaCloudUploadAlt, FaMagic } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { usePathname } from 'next/navigation';

interface FormData {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  branch_url: string;
  salon_img_url: string;
}

interface StepOneProps {
  step: number;
  onNextStep: () => void;
}

export default function StepOne({ step, onNextStep }: StepOneProps) {
  const pathname = usePathname();
  const userId = pathname.split('/')[1];
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    salon_name: '',
    salon_tag: '',
    opening_time: '',
    contact_email: '',
    contact_number: '',
    branch_url: '',
    salon_img_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return '';

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', imageFile);
    cloudinaryFormData.append('upload_preset', 'salon_preset');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dl1lqotns/image/upload',
        { method: 'POST', body: cloudinaryFormData }
      );

      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload image first
      const imageUrl = await uploadImageToCloudinary();
      const finalFormData = {
        ...formData,
        salon_img_url: imageUrl || formData.salon_img_url,
        user_id: userId
      };

      // Submit to backend
      const response = await axios.post(
        'https://salon-backend-3.onrender.com/api/salon/create',
        finalFormData
      );

      if (response.status === 201) {
        onNextStep();
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error creating salon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const floatingLabelVariants = {
    active: { 
      y: -10, 
      scale: 0.9, 
      color: "#ff758c",
      transition: { type: 'spring', stiffness: 300 }
    },
    inactive: { 
      y: 0, 
      scale: 1, 
      color: "#6b7280",
      transition: { duration: 0.2 }
    }
  };

  const inputContainerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotateX: -15,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 30px -10px rgba(255, 117, 140, 0.2)",
      transition: { duration: 0.2 }
    },
    focused: { 
      scale: 1.03,
      borderColor: "#ff758c",
      boxShadow: "0 15px 40px -10px rgba(255, 117, 140, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const inputRevealVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.2,
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };


  return (
    <AnimatePresence>
      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl shadow-xl"
        >
          <form onSubmit={handleSubmit}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] rounded-t-3xl" />
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center mb-10"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent mb-2"
              >
                Salon Information
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 flex items-center justify-center gap-2"
              >
                <FaMagic className="text-rose-300 animate-pulse" /> 
                Let s create something beautiful
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'salon_name', label: 'Salon Name *', type: 'text', required: true },
                { id: 'salon_tag', label: 'Salon Tagline *', type: 'text', required: true },
                { id: 'contact_email', label: 'Contact Email *', type: 'email', required: true },
                { id: 'contact_number', label: 'Contact Number *', type: 'tel', required: true },
                { id: 'opening_time', label: 'Establishment Date', type: 'date', required: false },
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  initial="hidden"
                  animate="visible"
                  variants={inputContainerVariants}
                  transition={{ delay: index * 0.1 }}
                  className={field.id === 'branch_url' || field.id === 'opening_time' ? 'md:col-span-2' : ''}
                >
                  <motion.div
                    className="relative h-16 bg-white rounded-xl p-3 shadow-sm overflow-hidden border border-gray-100"
                    variants={inputContainerVariants}
                    whileHover="hover"
                    animate={activeField === field.id ? 'focused' : 'visible'}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: activeField === field.id ? 1 : 0,
                        background: `linear-gradient(45deg, #ff758c 0%, #ff7eb3 100%)`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="absolute inset-[2px] bg-white rounded-xl" />
                    
                    <motion.label
                      className="absolute left-4 origin-left pointer-events-none text-sm"
                      variants={floatingLabelVariants}
                      animate={formData[field.id as keyof FormData] || activeField === field.id ? 'active' : 'inactive'}
                    >
                      {field.label}
                    </motion.label>
                    
                    <motion.div
                      variants={inputRevealVariants}
                      className="h-full"
                    >
                      <input
                        type={field.type}
                        className="w-full h-full pt-4 px-3 bg-transparent outline-none z-10 relative text-gray-700"
                        onFocus={() => setActiveField(field.id)}
                        onBlur={() => setActiveField(null)}
                        value={formData[field.id as keyof FormData]}
                        onChange={(e) => handleInputChange(field.id as keyof FormData, e.target.value)}
                        required={field.required}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}

              <motion.div
                className="col-span-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm text-rose-400 mb-3">Salon Image *</label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-rose-200 rounded-2xl cursor-pointer bg-white/50 backdrop-blur-sm hover:border-[#ff758c] transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: `linear-gradient(45deg, ${formData.salon_img_url ? 'transparent' : '#ff758c20'}, #ff7eb310)`
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                  
                  {formData.salon_img_url ? (
                    <>
                      <motion.img
                        src={formData.salon_img_url}
                        alt="Salon"
                        className="h-full w-full object-cover rounded-2xl z-10 relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      />
                      <motion.div
                        className="absolute bottom-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Click to change image
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      className="flex flex-col items-center z-10 relative p-4 text-center"
                      animate={{ y: [-5, 0, -5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <FaCloudUploadAlt className="text-4xl text-[#ff758c] mb-3" />
                      <p className="text-gray-500">
                        <span className="text-[#ff758c] font-semibold">Drag & Drop</span> your image here<br />
                        or <span className="text-[#ff758c]">click to browse</span><br />
                        <span className="text-xs">(PNG, JPG up to 5MB)</span>
                      </p>
                    </motion.div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg"
                    required={!formData.salon_img_url}
                  />
                </motion.label>
              </motion.div>
            </div>

            <motion.div
              className="flex justify-end mt-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="submit"
                whileHover={{ 
                  scale: 1.05,
                  background: `linear-gradient(45deg, #ff758c, #ff7eb3)`
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Save Salon 
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: 5 }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 0.8 
                    }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#ff7eb3] to-[#ff758c] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



