'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaCloudUploadAlt, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CreateSalonForm = () => {
  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    salon_name: '',
    salon_tag: '',
    opening_time: '',
    contact_email: '',
    contact_number: '',
    branch_url: '',
    salon_img_url: '',
    
    // Step 2
    branch: {
      branch_name: '',
      branch_location: '',
      contact_email: '',
      contact_number: '',
      opening_time: '',
      closing_time: ''
    },
    
    // Step 3
    staff: {
      fullname: '',
      email: '',
      contact: '',
      password: '',
      profile_img: '',
      staff_id: ''
    },
    
    // Step 4
    product: {
      product_name: '',
      product_quantity: 0,
      price: 0
    }
  });

  const steps = [
    { title: 'Basic Info', number: 1 },
    { title: 'Branches', number: 2 },
    { title: 'Staff', number: 3 },
    { title: 'Inventory', number: 4 },
    { title: 'Review', number: 5 },
  ];

  const handleImageUpload = (e: unknown) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, salon_img_url: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-16">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10">
              <motion.div
                className="h-full bg-[#b76e79]"
                initial={{ width: 0 }}
                animate={{ width: `${(step-1)*25}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <button
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white 
                    ${step >= s.number ? 'bg-[#b76e79] scale-110' : 'bg-gray-300'}`}
                >
                  {step > s.number ? <FaCheck /> : s.number}
                </button>
                <span className={`mt-2 text-sm ${step >= s.number ? 'text-[#b76e79]' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          {step === 1 && (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Salon Information</h2>
    
    <div className="grid grid-cols-2 gap-6">
      {/* Salon Name */}
      <div>
        <label className="block text-gray-700 mb-2">Salon Name *</label>
        <input
          className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
          value={formData.salon_name}
          onChange={(e) => setFormData({...formData, salon_name: e.target.value})}
          required
        />
      </div>

      {/* Salon Tagline */}
      <div>
        <label className="block text-gray-700 mb-2">Salon Tagline *</label>
        <input
          className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
          value={formData.salon_tag}
          onChange={(e) => setFormData({...formData, salon_tag: e.target.value})}
          required
        />
      </div>

      {/* Contact Email */}
      <div>
        <label className="block text-gray-700 mb-2">Contact Email *</label>
        <input
          type="email"
          className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
          value={formData.contact_email}
          onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
          required
        />
      </div>

      {/* Contact Number */}
      <div>
        <label className="block text-gray-700 mb-2">Contact Number *</label>
        <input
          type="tel"
          className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
          value={formData.contact_number}
          onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
          required
        />
      </div>

      {/* Establishment Date */}
      <div>
        <label className="block text-gray-700 mb-2">Establishment Date</label>
        <input
          type="date"
          className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
          value={formData.opening_time}
          onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
        />
      </div>

      {/* Salon Image Upload */}
      <div className="col-span-2">
        <label className="block text-gray-700 mb-2">Salon Image</label>
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#e8c4c0] rounded-xl cursor-pointer hover:border-[#b76e79] transition-colors">
          {formData.salon_img_url ? (
            <img src={formData.salon_img_url} alt="Salon" className="h-full w-full object-cover rounded-xl" />
          ) : (
            <>
              <FaCloudUploadAlt className="text-3xl text-[#b76e79] mb-2" />
              <p className="text-gray-500">Click to upload salon image</p>
            </>
          )}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
    </div>
  </div>
)}

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
          {/* Column 1 */}
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

          {/* Column 2 */}
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

          {/* Add similar sections for Staff, Inventory, and Review steps */}

          {/* Navigation Controls */}
          <div className="flex justify-between mt-12">
            {step > 1 && (
              <button
                className="flex items-center gap-2 text-[#b76e79] hover:text-[#a55d68] font-semibold"
                onClick={() => setStep(step - 1)}
              >
                <FaChevronLeft /> Previous
              </button>
            )}
            
            <div className="flex-grow" />
            
            {step < 5 ? (
              <button
                className="bg-[#b76e79] text-white px-8 py-3 rounded-xl hover:bg-[#a55d68] transition-colors flex items-center gap-2"
                onClick={() => setStep(step + 1)}
              >
                Next <FaChevronRight />
              </button>
            ) : (
              <button
                className="bg-[#b76e79] text-white px-8 py-3 rounded-xl hover:bg-[#a55d68] transition-colors"
                onClick={() => console.log('Submit', formData)}
              >
                Save & Go to Home
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSalonForm;