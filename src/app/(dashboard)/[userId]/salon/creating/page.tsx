'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheck, FaChevronLeft, FaChevronRight, FaUser, FaStore, FaBoxes, FaClipboardCheck } from 'react-icons/fa';
import StepOne from '@/Components/StepOne';

// Define TypeScript interfaces
interface Branch {
  branch_name: string;
  branch_location: string;
  contact_email: string;
  contact_number: string;
  opening_time: string;
  closing_time: string;
}

interface StaffMember {
  fullname: string;
  email: string;
  contact: string;
  password: string;
  profile_img: string;
  staff_id: string;
}

interface Product {
  product_name: string;
  product_quantity: number;
  price: number;
}

interface FormData {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  branch_url: string;
  salon_img_url: string;
  branch: Branch;
  staff: StaffMember;
  product: Product;
}

const CreateSalonForm = () => {
  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    salon_name: '',
    salon_tag: '',
    opening_time: '',
    contact_email: '',
    contact_number: '',
    branch_url: '',
    salon_img_url: '',
    branch: {
      branch_name: '',
      branch_location: '',
      contact_email: '',
      contact_number: '',
      opening_time: '',
      closing_time: ''
    },
    staff: {
      fullname: '',
      email: '',
      contact: '',
      password: '',
      profile_img: '',
      staff_id: ''
    },
    product: {
      product_name: '',
      product_quantity: 0,
      price: 0
    }
  });

  // ... rest of your component code remains the same ...

  const steps = [
    { title: 'Basic Info', number: 1, icon: <FaStore />, color: 'from-[#FF9A8B] to-[#FF6B95]' },
    { title: 'Branches', number: 2, icon: <FaPlus />, color: 'from-[#FF6B95] to-[#FF8E53]' },
    { title: 'Staff', number: 3, icon: <FaUser />, color: 'from-[#FF8E53] to-[#FFD166]' },
    { title: 'Inventory', number: 4, icon: <FaBoxes />, color: 'from-[#FFD166] to-[#06D6A0]' },
    { title: 'Review', number: 5, icon: <FaClipboardCheck />, color: 'from-[#06D6A0] to-[#118AB2]' },
  ];

  

  const calculateProgress = () => ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#fff9f7] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Tracker - Enhanced for Mobile */}
        <div className="mb-12 lg:mb-16 px-4 sm:px-8">
          <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full -z-10" />
            
            <motion.div
              className="absolute top-1/4 left-0 h-2 sm:h-3 rounded-full bg-gradient-to-r from-[#FF9A8B] via-[#FF6B95] via-[#FF8E53] via-[#FFD166] via-[#06D6A0] to-[#118AB2]"
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            <div className="flex justify-between relative">
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center z-10">
                  <motion.button
                    className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg
                      ${step >= s.number ? 
                        `bg-gradient-to-br ${s.color} shadow-md` : 
                        'bg-gray-300'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => step > s.number && setStep(s.number)}
                  >
                    <div className="scale-75 sm:scale-100">
                      {step > s.number ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <FaCheck />
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ 
                            scale: step === s.number ? [1, 1.1, 1] : 1,
                            rotate: step === s.number ? [0, 5, -5, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {s.icon}
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                  
                  <motion.div
                    className="mt-2 sm:mt-3 text-center hidden sm:block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className={`text-xs sm:text-sm font-medium ${step >= s.number ? 'text-gray-800' : 'text-gray-400'}`}>
                      {s.title}
                    </p>
                    <p className={`text-[10px] sm:text-xs ${step >= s.number ? 'text-gray-600' : 'text-gray-400'}`}>
                      Step {s.number}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="sm:hidden mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#b76e79]">
            {steps[step - 1].title}
          </h2>
          <p className="text-gray-500 text-sm">
            Step {step} of {steps.length}
          </p>
        </div>

        {/* Form Content */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden"
          >
            {/* Step 1 - Salon Information */}
            <StepOne step={step}/>

            {/* Step 2 - Branches */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Add Branches</h2>
                
                {branches.map((branch, index) => (
                  <div key={index} className="bg-[#fff9f7] p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#b76e79]">{branch.branch_name}</h3>
                      <span className="bg-[#e8c4c0] text-[#b76e79] px-3 py-1 rounded-full text-sm">
                        Added
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Location:</span> {branch.branch_location}</p>
                        <p className="text-gray-600"><span className="font-medium">Email:</span> {branch.contact_email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Contact:</span> {branch.contact_number}</p>
                        <p className="text-gray-600"><span className="font-medium">Hours:</span> {branch.opening_time} - {branch.closing_time}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {(showBranchForm || branches.length === 0) && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Branch Name *</label>
                          <input
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.branch.branch_name}
                            onChange={(e) => setFormData({...formData, branch: {...formData.branch, branch_name: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Contact Email *</label>
                          <input
                            type="email"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.branch.contact_email}
                            onChange={(e) => setFormData({...formData, branch: {...formData.branch, contact_email: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Opening Time *</label>
                          <input
                            type="time"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.branch.opening_time}
                            onChange={(e) => setFormData({...formData, branch: {...formData.branch, opening_time: e.target.value}})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Location *</label>
                          <input
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.branch.branch_location}
                            onChange={(e) => setFormData({...formData, branch: {...formData.branch, branch_location: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Contact Number *</label>
                          <input
                            type="tel"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.branch.contact_number}
                            onChange={(e) => setFormData({...formData, branch: {...formData.branch, contact_number: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Closing Time *</label>
                          <input
                            type="time"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.branch.closing_time}
                            onChange={(e) => setFormData({...formData, branch: {...formData.branch, closing_time: e.target.value}})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#b76e79] text-white py-4 rounded-xl font-semibold hover:bg-[#a55d68] transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        if (formData.branch.branch_name && 
                            formData.branch.branch_location && 
                            formData.branch.contact_email && 
                            formData.branch.contact_number) {
                          setBranches([...branches, formData.branch]);
                          setFormData({...formData, branch: {
                            branch_name: '',
                            branch_location: '',
                            contact_email: '',
                            contact_number: '',
                            opening_time: '',
                            closing_time: ''
                          }});
                          setShowBranchForm(false);
                        }
                      }}
                    >
                      <FaPlus /> Add Branch
                    </button>
                  </div>
                )}

                {!showBranchForm && branches.length > 0 && (
                  <button
                    className="w-full border-2 border-dashed border-[#e8c4c0] text-[#b76e79] py-4 rounded-xl font-semibold hover:border-[#b76e79] transition-colors flex items-center justify-center gap-2"
                    onClick={() => setShowBranchForm(true)}
                  >
                    <FaPlus /> Add Another Branch
                  </button>
                )}
              </div>
            )}

            {/* Step 3 - Staff */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Add Staff Members</h2>
                
                {staff.map((staffMember, index) => (
                  <div key={index} className="bg-[#fff9f7] p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#b76e79]">{staffMember.fullname}</h3>
                      <span className="bg-[#e8c4c0] text-[#b76e79] px-3 py-1 rounded-full text-sm">
                        Added
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Email:</span> {staffMember.email}</p>
                        <p className="text-gray-600"><span className="font-medium">Contact:</span> {staffMember.contact}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Staff ID:</span> {staffMember.staff_id}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {(showStaffForm || staff.length === 0) && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Full Name *</label>
                          <input
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.staff.fullname}
                            onChange={(e) => setFormData({...formData, staff: {...formData.staff, fullname: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Email *</label>
                          <input
                            type="email"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.staff.email}
                            onChange={(e) => setFormData({...formData, staff: {...formData.staff, email: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Password *</label>
                          <input
                            type="password"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.staff.password}
                            onChange={(e) => setFormData({...formData, staff: {...formData.staff, password: e.target.value}})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Contact Number *</label>
                          <input
                            type="tel"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.staff.contact}
                            onChange={(e) => setFormData({...formData, staff: {...formData.staff, contact: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Staff ID *</label>
                          <input
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            value={formData.staff.staff_id}
                            onChange={(e) => setFormData({...formData, staff: {...formData.staff, staff_id: e.target.value}})}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Profile Image</label>
                          <input
                            type="file"
                            className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({...formData, staff: {...formData.staff, profile_img: reader.result as string}});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#b76e79] text-white py-4 rounded-xl font-semibold hover:bg-[#a55d68] transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        if (formData.staff.fullname && 
                            formData.staff.email && 
                            formData.staff.contact && 
                            formData.staff.password) {
                          setStaff([...staff, formData.staff]);
                          setFormData({...formData, staff: {
                            fullname: '',
                            email: '',
                            contact: '',
                            password: '',
                            profile_img: '',
                            staff_id: ''
                          }});
                          setShowStaffForm(false);
                        }
                      }}
                    >
                      <FaPlus /> Add Staff
                    </button>
                  </div>
                )}

                {!showStaffForm && staff.length > 0 && (
                  <button
                    className="w-full border-2 border-dashed border-[#e8c4c0] text-[#b76e79] py-4 rounded-xl font-semibold hover:border-[#b76e79] transition-colors flex items-center justify-center gap-2"
                    onClick={() => setShowStaffForm(true)}
                  >
                    <FaPlus /> Add Another Staff Member
                  </button>
                )}
              </div>
            )}

            {/* Step 4 - Inventory */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Manage Inventory</h2>
                
                {inventory.map((item, index) => (
                  <div key={index} className="bg-[#fff9f7] p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#b76e79]">{item.product_name}</h3>
                      <span className="bg-[#e8c4c0] text-[#b76e79] px-3 py-1 rounded-full text-sm">
                        {item.product_quantity} in stock
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Price:</span> ${item.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Value:</span> ${item.price * item.product_quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {(showInventoryForm || inventory.length === 0) && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Product Name *</label>
                        <input
                          className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                          value={formData.product.product_name}
                          onChange={(e) => setFormData({...formData, product: {...formData.product, product_name: e.target.value}})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Quantity *</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                          value={formData.product.product_quantity}
                          onChange={(e) => setFormData({...formData, product: {...formData.product, product_quantity: parseInt(e.target.value) || 0}})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Price *</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                          value={formData.product.price}
                          onChange={(e) => setFormData({...formData, product: {...formData.product, price: parseFloat(e.target.value) || 0}})}
                          required
                        />
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#b76e79] text-white py-4 rounded-xl font-semibold hover:bg-[#a55d68] transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        if (formData.product.product_name && 
                            formData.product.product_quantity && 
                            formData.product.price) {
                          setInventory([...inventory, formData.product]);
                          setFormData({...formData, product: {
                            product_name: '',
                            product_quantity: 0,
                            price: 0
                          }});
                          setShowInventoryForm(false);
                        }
                      }}
                    >
                      <FaPlus /> Add Product
                    </button>
                  </div>
                )}

                {!showInventoryForm && inventory.length > 0 && (
                  <button
                    className="w-full border-2 border-dashed border-[#e8c4c0] text-[#b76e79] py-4 rounded-xl font-semibold hover:border-[#b76e79] transition-colors flex items-center justify-center gap-2"
                    onClick={() => setShowInventoryForm(true)}
                  >
                    <FaPlus /> Add Another Product
                  </button>
                )}
              </div>
            )}

            {/* Step 5 - Review */}
            {step === 5 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Review Your Salon Setup</h2>
                
                <div className="bg-[#fff9f7] p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Salon Details</h3>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Salon Name:</span> {formData.salon_name}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Tagline:</span> {formData.salon_tag}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Established:</span> {formData.opening_time || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Contact Email:</span> {formData.contact_email}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Contact Number:</span> {formData.contact_number}</p>
                    </div>
                  </div>

                  {branches.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Branches ({branches.length})</h3>
                      <div className="space-y-4 mb-8">
                        {branches.map((branch, index) => (
                          <div key={index} className="border-l-4 border-[#e8c4c0] pl-4 py-2">
                            <h4 className="font-medium text-gray-800">{branch.branch_name}</h4>
                            <p className="text-gray-600">{branch.branch_location}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {staff.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Staff Members ({staff.length})</h3>
                      <div className="space-y-4 mb-8">
                        {staff.map((staffMember, index) => (
                          <div key={index} className="border-l-4 border-[#e8c4c0] pl-4 py-2">
                            <h4 className="font-medium text-gray-800">{staffMember.fullname}</h4>
                            <p className="text-gray-600">{staffMember.email}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {inventory.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Inventory Items ({inventory.length})</h3>
                      <div className="space-y-4">
                        {inventory.map((item, index) => (
                          <div key={index} className="border-l-4 border-[#e8c4c0] pl-4 py-2">
                            <h4 className="font-medium text-gray-800">{item.product_name}</h4>
                            <p className="text-gray-600">{item.product_quantity} units at ${item.price} each</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between mt-12">
              {step > 1 && (
                <motion.button
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-[#b76e79] hover:text-[#a55d68] font-semibold"
                  onClick={() => setStep(step - 1)}
                >
                  <FaChevronLeft /> Previous
                </motion.button>
              )}
              
              <div className="flex-grow" />
              
              {step < 5 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#b76e79] text-white px-8 py-3 rounded-xl hover:bg-[#a55d68] transition-colors flex items-center gap-2"
                  onClick={() => setStep(step + 1)}
                >
                  Next <FaChevronRight />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#b76e79] text-white px-8 py-3 rounded-xl hover:bg-[#a55d68] transition-colors"
                  onClick={() => console.log('Submit', formData)}
                >
                  Save & Go to Home
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateSalonForm;