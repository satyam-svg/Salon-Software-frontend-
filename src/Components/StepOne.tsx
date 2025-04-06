'use client';
import { useState } from 'react';
import { FaCloudUploadAlt, FaChevronRight, FaSave } from 'react-icons/fa';
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

export default function StepOne({ step, onNextStep }: { step: number; onNextStep: () => void }) {
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
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
      const imageUrl = await uploadImageToCloudinary();
      const finalFormData = {
        ...formData,
        salon_img_url: imageUrl || formData.salon_img_url,
        user_id: userId
      };

      const response = await axios.post(
        'https://salon-backend-3.onrender.com/api/salon/create',
        finalFormData
      );

      if (response.status === 201) {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        onNextStep();
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error creating salon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const floatingLabelVariants = {
    active: { 
      y: -20, 
      scale: 0.8,
      color: "#FF72B6",
      transition: { type: 'spring', stiffness: 300 }
    },
    inactive: { 
      y: 0, 
      scale: 1, 
      color: "#8B8D9D",
      transition: { duration: 0.2 }
    }
  };

  const inputContainerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    },
    hover: { 
      y: -3,
      boxShadow: "0 25px 50px -12px rgba(255, 114, 182, 0.15)",
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  return (
    <AnimatePresence>
      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="relative bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] p-8 rounded-3xl shadow-lg max-w-4xl mx-auto border border-gray-200 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute w-72 h-72 bg-[#FF72B6] blur-[100px] -top-20 -left-20 opacity-10"></div>
            <div className="absolute w-72 h-72 bg-[#7B61FF] blur-[100px] -bottom-20 -right-20 opacity-10"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FF72B6] to-[#7B61FF] bg-clip-text text-transparent mb-4">
                Salon Profile Setup
              </h2>
              <p className="text-gray-600 text-lg">
                Complete your salon's profile to get started
              </p>
            </motion.div>

            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'salon_name', label: 'Salon Name', type: 'text', icon: '✂️' },
                  { id: 'salon_tag', label: 'Tagline', type: 'text', icon: '🏷️' },
                  { id: 'contact_email', label: 'Email', type: 'email', icon: '✉️' },
                  { id: 'contact_number', label: 'Phone', type: 'tel', icon: '📱' },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    variants={itemVariants}
                    className="relative group"
                  >
                    <motion.div
                      className="h-16 bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF72B6]/50 transition-colors shadow-sm"
                      variants={inputContainerVariants}
                      whileHover="hover"
                    >
                      <motion.label
                        className="absolute left-4 origin-left pointer-events-none flex items-center gap-2"
                        variants={floatingLabelVariants}
                        animate={formData[field.id as keyof FormData] || activeField === field.id ? 'active' : 'inactive'}
                      >
                        <span className="text-lg">{field.icon}</span>
                        <span className="text-sm font-medium">{field.label}</span>
                      </motion.label>
                      
                      <input
                        type={field.type}
                        className="w-full h-full pt-6 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                        onFocus={() => setActiveField(field.id)}
                        onBlur={() => setActiveField(null)}
                        value={formData[field.id as keyof FormData]}
                        onChange={(e) => handleInputChange(field.id as keyof FormData, e.target.value)}
                        required
                      />
                    </motion.div>
                  </motion.div>
                ))}

                <motion.div
                  variants={itemVariants}
                  className="md:col-span-2"
                >
                  <motion.div
                    className="relative group bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FF72B6]/50 transition-colors shadow-sm"
                    variants={inputContainerVariants}
                  >
                    <motion.label
                      className="absolute left-4 origin-left pointer-events-none flex items-center gap-2"
                      variants={floatingLabelVariants}
                      animate={formData.opening_time || activeField === 'opening_time' ? 'active' : 'inactive'}
                    >
                      <span className="text-lg">🗓</span>
                      <span className="text-sm font-medium">Established Date</span>
                    </motion.label>
                    
                    <input
                      type="date"
                      className="w-full h-full pt-6 px-3 bg-transparent outline-none text-gray-800"
                      onFocus={() => setActiveField('opening_time')}
                      onBlur={() => setActiveField(null)}
                      value={formData.opening_time}
                      onChange={(e) => handleInputChange('opening_time', e.target.value)}
                      required
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="md:col-span-2"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FF72B6] to-[#7B61FF] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <motion.div
                      initial={{ y: 0 }}
                      whileHover={{ y: -3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="relative bg-white rounded-xl border border-gray-200 hover:border-[#FF72B6]/50 transition-colors shadow-sm"
                    >
                      <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
                        <div className="mb-4 text-gray-400 group-hover:text-[#FF72B6] transition-colors">
                          <FaCloudUploadAlt className="w-12 h-12 mb-4 mx-auto transition-transform group-hover:scale-110" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-700 group-hover:text-[#FF72B6] transition-colors mb-2">
                            Upload Salon Image
                          </p>
                          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                            PNG or JPG (max. 5MB)
                          </p>
                        </div>
                        {imagePreview && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 w-full overflow-hidden rounded-lg"
                          >
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-40 object-cover border border-gray-200"
                            />
                          </motion.div>
                        )}
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/png, image/jpeg"
                          required={!formData.salon_img_url && !imagePreview}
                          className="hidden"
                        />
                      </label>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="pt-4 flex justify-end"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF72B6] to-[#7B61FF] rounded-xl font-bold text-white hover:shadow-lg hover:shadow-[#FF72B6]/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
                  {isSubmitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                        Save Salon
                      </span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}