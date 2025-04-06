'use client';
import { useState } from 'react';
import { FaPlus, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Branch {
  branch_name: string;
  branch_location: string;
  contact_email: string;
  contact_number: string;
  opening_time: string;
  closing_time: string;
}

interface StepTwoProps {
  step: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
  formData: { branches: Branch[] };
  updateFormData: (data: { branches: Branch[] }) => void;
}

export default function StepTwo({ step, onNextStep, onPreviousStep, formData, updateFormData }: StepTwoProps) {
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [currentBranch, setCurrentBranch] = useState<Branch>({
    branch_name: "",
    branch_location: "",
    contact_email: "",
    contact_number: "",
    opening_time: "",
    closing_time: "",
  });

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

  const branchCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const addBranch = () => {
    if (
      currentBranch.branch_name &&
      currentBranch.branch_location &&
      currentBranch.contact_email &&
      currentBranch.contact_number
    ) {
      const updatedBranches = [...formData.branches, currentBranch];
      updateFormData({ branches: updatedBranches });
      setCurrentBranch({
        branch_name: "",
        branch_location: "",
        contact_email: "",
        contact_number: "",
        opening_time: "",
        closing_time: "",
      });
      setShowBranchForm(false);
    }
  };

  return (
    <AnimatePresence>
      {step === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff8E53] to-[#FFD166] rounded-t-3xl" />
          
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-center mb-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-[#ff8E53] to-[#FFD166] bg-clip-text text-transparent mb-2"
            >
              Salon Branches
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600"
            >
              Add all your salon branches with their details
            </motion.p>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence>
              {formData.branches.map((branch, index) => (
                <motion.div
                  key={index}
                  variants={branchCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#ff8E53]">
                      {branch.branch_name}
                    </h3>
                    <motion.span 
                      className="bg-[#FFD166] text-[#ff8E53] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaCheck /> Added
                    </motion.span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#ff8E53]">Location:</span>{" "}
                        {branch.branch_location}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#ff8E53]">Email:</span>{" "}
                        {branch.contact_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#ff8E53]">Contact:</span>{" "}
                        {branch.contact_number}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium text-[#ff8E53]">Hours:</span>{" "}
                        {branch.opening_time} - {branch.closing_time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(showBranchForm || formData.branches.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {[
                      { id: 'branch_name', label: 'Branch Name *', type: 'text' },
                      { id: 'contact_email', label: 'Contact Email *', type: 'email' },
                      { id: 'opening_time', label: 'Opening Time *', type: 'time' },
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
                              background: `linear-gradient(45deg, #ff8E53 0%, #FFD166 100%)`
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <div className="absolute inset-[2px] bg-white rounded-xl" />
                          
                          <motion.label
                            className="absolute left-4 origin-left pointer-events-none text-sm"
                            variants={floatingLabelVariants}
                            animate={currentBranch[field.id as keyof Branch] || activeField === field.id ? 'active' : 'inactive'}
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
                              value={currentBranch[field.id as keyof Branch]}
                              onChange={(e) => setCurrentBranch({
                                ...currentBranch,
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
                      { id: 'branch_location', label: 'Location *', type: 'text' },
                      { id: 'contact_number', label: 'Contact Number *', type: 'tel' },
                      { id: 'closing_time', label: 'Closing Time *', type: 'time' },
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
                              background: `linear-gradient(45deg, #ff8E53 0%, #FFD166 100%)`
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <div className="absolute inset-[2px] bg-white rounded-xl" />
                          
                          <motion.label
                            className="absolute left-4 origin-left pointer-events-none text-sm"
                            variants={floatingLabelVariants}
                            animate={currentBranch[field.id as keyof Branch] || activeField === field.id ? 'active' : 'inactive'}
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
                              value={currentBranch[field.id as keyof Branch]}
                              onChange={(e) => setCurrentBranch({
                                ...currentBranch,
                                [field.id]: e.target.value
                              })}
                              required
                            />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#ff8E53] to-[#FFD166] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  onClick={addBranch}
                >
                  <FaPlus /> Add Branch
                </motion.button>
              </motion.div>
            )}

            {!showBranchForm && formData.branches.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-dashed border-[#FFD166] text-[#ff8E53] py-4 rounded-xl font-semibold hover:border-[#ff8E53] transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowBranchForm(true)}
              >
                <FaPlus /> Add Another Branch
              </motion.button>
            )}
          </div>

          <div className="flex justify-between mt-12">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[#ff8E53] hover:text-[#e07d42] font-semibold"
              onClick={onPreviousStep}
            >
              <FaChevronLeft /> Previous
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#ff8E53] to-[#FFD166] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-colors flex items-center gap-2"
              onClick={onNextStep}
              disabled={formData.branches.length === 0}
            >
              Save Salon<FaChevronRight />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}