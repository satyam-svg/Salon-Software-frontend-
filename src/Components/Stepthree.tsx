'use client';
import { useState } from 'react';
import { FaPlus, FaCheck, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface StaffMember {
  fullname: string;
  email: string;
  contact: string;
  password: string;
  profile_img: string;
  staff_id: string;
}

interface StepThreeProps {
  step: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
  formData: { staff: StaffMember[] };
  updateFormData: (data: { staff: StaffMember[] }) => void;
}

export default function StepThree({ step, onNextStep, onPreviousStep, formData, updateFormData }: StepThreeProps) {
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffMember>({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    profile_img: '',
    staff_id: ''
  });

  const floatingLabelVariants = {
    active: { 
      y: -10, 
      scale: 0.9, 
      color: "#FFD166",
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
      boxShadow: "0 10px 30px -10px rgba(255, 209, 102, 0.2)",
      transition: { duration: 0.2 }
    },
    focused: { 
      scale: 1.03,
      borderColor: "#FFD166",
      boxShadow: "0 15px 40px -10px rgba(255, 209, 102, 0.3)",
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

  const staffCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentStaff({
          ...currentStaff,
          profile_img: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addStaff = () => {
    if (
      currentStaff.fullname &&
      currentStaff.email &&
      currentStaff.contact &&
      currentStaff.password
    ) {
      const updatedStaff = [...formData.staff, currentStaff];
      updateFormData({ staff: updatedStaff });
      setCurrentStaff({
        fullname: '',
        email: '',
        contact: '',
        password: '',
        profile_img: '',
        staff_id: ''
      });
      setShowStaffForm(false);
    }
  };

  return (
    <AnimatePresence>
      {step === 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-3xl shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFD166] to-[#06D6A0] rounded-t-3xl" />
          
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-center mb-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-[#FFD166] to-[#06D6A0] bg-clip-text text-transparent mb-2"
            >
              Staff Members
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 flex items-center justify-center gap-2"
            >
              <FaUser className="text-[#FFD166] animate-pulse" /> 
              Add your salon staff members
            </motion.p>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence>
              {formData.staff.map((staffMember, index) => (
                <motion.div
                  key={index}
                  variants={staffCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#FFD166]">
                      {staffMember.fullname}
                    </h3>
                    <motion.span 
                      className="bg-[#06D6A0] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaCheck /> Added
                    </motion.span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#FFD166]">Email:</span>{" "}
                        {staffMember.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#FFD166]">Contact:</span>{" "}
                        {staffMember.contact}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#FFD166]">Staff ID:</span>{" "}
                        {staffMember.staff_id}
                      </p>
                      {staffMember.profile_img && (
                        <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFD166]">
                          <img 
                            src={staffMember.profile_img} 
                            alt="Staff" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(showStaffForm || formData.staff.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {[
                      { id: 'fullname', label: 'Full Name *', type: 'text' },
                      { id: 'email', label: 'Email *', type: 'email' },
                      { id: 'password', label: 'Password *', type: 'password' },
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial="hidden"
                        animate="visible"
                        variants={inputContainerVariants}
                        transition={{ delay: index * 0.1 }}
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
                              background: `linear-gradient(45deg, #FFD166 0%, #06D6A0 100%)`
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <div className="absolute inset-[2px] bg-white rounded-xl" />
                          
                          <motion.label
                            className="absolute left-4 origin-left pointer-events-none text-sm"
                            variants={floatingLabelVariants}
                            animate={currentStaff[field.id as keyof StaffMember] || activeField === field.id ? 'active' : 'inactive'}
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
                              value={currentStaff[field.id as keyof StaffMember]}
                              onChange={(e) => setCurrentStaff({
                                ...currentStaff,
                                [field.id]: e.target.value
                              })}
                              required
                            />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {[
                      { id: 'contact', label: 'Contact Number *', type: 'tel' },
                      { id: 'staff_id', label: 'Staff ID', type: 'text' },
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial="hidden"
                        animate="visible"
                        variants={inputContainerVariants}
                        transition={{ delay: index * 0.1 }}
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
                              background: `linear-gradient(45deg, #FFD166 0%, #06D6A0 100%)`
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <div className="absolute inset-[2px] bg-white rounded-xl" />
                          
                          <motion.label
                            className="absolute left-4 origin-left pointer-events-none text-sm"
                            variants={floatingLabelVariants}
                            animate={currentStaff[field.id as keyof StaffMember] || activeField === field.id ? 'active' : 'inactive'}
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
                              value={currentStaff[field.id as keyof StaffMember]}
                              onChange={(e) => setCurrentStaff({
                                ...currentStaff,
                                [field.id]: e.target.value
                              })}
                              required={field.id === 'contact'}
                            />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}

                    <div className="mt-4">
                      <label className="block text-sm text-[#06D6A0] mb-3">Profile Image</label>
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#FFD166] rounded-2xl cursor-pointer bg-white/50 backdrop-blur-sm hover:border-[#06D6A0] transition-all relative overflow-hidden"
                      >
                        {currentStaff.profile_img ? (
                          <>
                            <motion.img
                              src={currentStaff.profile_img}
                              alt="Staff"
                              className="h-full w-full object-cover rounded-2xl z-10 relative"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                            />
                            <motion.div
                              className="absolute bottom-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg z-20 text-xs"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              Click to change
                            </motion.div>
                          </>
                        ) : (
                          <motion.div
                            className="flex flex-col items-center z-10 relative p-2 text-center"
                            animate={{ y: [-3, 0, -3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <FaUser className="text-2xl text-[#FFD166] mb-1" />
                            <p className="text-gray-500 text-sm">
                              <span className="text-[#FFD166]">Upload photo</span>
                            </p>
                          </motion.div>
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageUpload}
                          accept="image/png, image/jpeg"
                        />
                      </motion.label>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#FFD166] to-[#06D6A0] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  onClick={addStaff}
                >
                  <FaPlus /> Add Staff Member
                </motion.button>
              </motion.div>
            )}

            {!showStaffForm && formData.staff.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-dashed border-[#FFD166] text-[#06D6A0] py-4 rounded-xl font-semibold hover:border-[#06D6A0] transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowStaffForm(true)}
              >
                <FaPlus /> Add Another Staff Member
              </motion.button>
            )}
          </div>

          <div className="flex justify-between mt-12">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[#FFD166] hover:text-[#e6bc5a] font-semibold"
              onClick={onPreviousStep}
            >
              <FaChevronLeft /> Previous
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#FFD166] to-[#06D6A0] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-colors flex items-center gap-2"
              onClick={onNextStep}
              disabled={formData.staff.length === 0}
            >
              Save Salon <FaChevronRight />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}