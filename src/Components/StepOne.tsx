'use client';
import { useState } from "react";
import { FaCloudUploadAlt, FaMagic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  branch_url: string;
  salon_img_url: string;
}

export default function StepOne({ step }: { step: number }) {
  const [formData, setFormData] = useState<FormData>({
    salon_name: '',
    salon_tag: '',
    opening_time: '',
    contact_email: '',
    contact_number: '',
    branch_url: '',
    salon_img_url: '',
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, salon_img_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const floatingLabelVariants = {
    active: { y: -10, scale: 0.9, color: "#ff758c" },
    inactive: { y: 0, scale: 1, color: "#6b7280" }
  };

  const inputContainerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: -15 },
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
      boxShadow: "0 10px 30px -10px rgba(255, 117, 140, 0.2)"
    },
    focused: { 
      scale: 1.03,
      borderColor: "#ff758c",
      boxShadow: "0 15px 40px -10px rgba(255, 117, 140, 0.3)"
    }
  };

  const inputRevealVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.2,
        type: "spring",
        stiffness: 120
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
              Let  create something beautiful
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { id: 'salon_name', label: 'Salon Name *', type: 'text' },
              { id: 'salon_tag', label: 'Salon Tagline *', type: 'text' },
              { id: 'contact_email', label: 'Contact Email *', type: 'email' },
              { id: 'contact_number', label: 'Contact Number *', type: 'tel' },
              { id: 'opening_time', label: 'Establishment Date', type: 'date' },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial="hidden"
                animate="visible"
                variants={inputContainerVariants}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="relative h-16 bg-white rounded-xl p-3 shadow-sm overflow-hidden"
                  variants={inputContainerVariants}
                  whileHover="hover"
                  animate={activeField === field.id ? 'focused' : 'visible'}
                >
                  {/* Animated border gradient */}
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
                    className="absolute left-4 origin-left pointer-events-none"
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
                      className="w-full h-full pt-4 px-3 bg-transparent outline-none z-10 relative"
                      onFocus={() => setActiveField(field.id)}
                      onBlur={() => setActiveField(null)}
                      value={formData[field.id as keyof FormData]}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      required
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
              <label className="block text-sm text-rose-400 mb-3">Salon Image</label>
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-rose-200 rounded-2xl cursor-pointer bg-white/50 backdrop-blur-sm hover:border-[#ff758c] transition-all relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: `linear-gradient(45deg, ${formData.salon_img_url ? 'transparent' : '#ff758c20'}, #ff7eb310)`
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                
                {formData.salon_img_url ? (
                  <motion.img
                    src={formData.salon_img_url}
                    alt="Salon"
                    className="h-full w-full object-cover rounded-2xl z-10 relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />
                ) : (
                  <motion.div
                    className="flex flex-col items-center z-10 relative"
                    animate={{ y: [-5, 0, -5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FaCloudUploadAlt className="text-4xl text-[#ff758c] mb-3" />
                    <p className="text-gray-500 text-center">
                      <span className="text-[#ff758c] font-semibold">Drag & Drop</span><br />
                      or click to upload<br />
                      (PNG, JPG up to 5MB)
                    </p>
                  </motion.div>
                )}
                <input type="file" className="hidden" onChange={handleImageUpload} />
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
              whileHover={{ 
                scale: 1.05,
                background: `linear-gradient(45deg, #ff758c, #ff7eb3)`
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
            >
              {/* Button animation elements */}
              
              Save Salon →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}