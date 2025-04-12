'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiScissors, FiImage, FiSave } from 'react-icons/fi';

const GeneralSettingsPage = () => {
  // Owner Details State
  const [ownerDetails, setOwnerDetails] = useState({
    name: 'John Doe',
    email: 'john@salon.com',
    contact: '+1 555 123 4567',
    imgUrl: 'https://example.com/owner.jpg'
  });

  // Salon Details State
  const [salonDetails, setSalonDetails] = useState({
    salonName: 'Luxury Style Studio',
    salonTag: 'Premium Beauty Experience',
    salonImgUrl: 'https://example.com/salon.jpg',
    contactEmail: 'info@luxurystyles.com',
    contactNumber: '+1 555 987 6543'
  });

  // Handle Input Changes
  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerDetails({ ...ownerDetails, [e.target.name]: e.target.value });
  };

  const handleSalonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalonDetails({ ...salonDetails, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent, type: 'owner' | 'salon') => {
    e.preventDefault();
    // Add your save logic here
    console.log(type === 'owner' ? ownerDetails : salonDetails);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Owner Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FiUser className="text-purple-600" />
            Owner Details
          </h2>

          <form onSubmit={(e) => handleSubmit(e, 'owner')} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Owner Name</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    name="name"
                    value={ownerDetails.name}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiMail className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={ownerDetails.email}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Contact Number</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiPhone className="text-gray-400" />
                  <input
                    type="tel"
                    name="contact"
                    value={ownerDetails.contact}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Image URL</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiImage className="text-gray-400" />
                  <input
                    type="url"
                    name="imgUrl"
                    value={ownerDetails.imgUrl}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {ownerDetails.imgUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Image Preview</p>
                <img 
                  src={ownerDetails.imgUrl} 
                  alt="Owner Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                />
              </div>
            )}

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg"
                type="submit"
              >
                <FiSave />
                Save Owner Details
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Salon Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FiScissors className="text-purple-600" />
            Salon Details
          </h2>

          <form onSubmit={(e) => handleSubmit(e, 'salon')} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Salon Name</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    name="salonName"
                    value={salonDetails.salonName}
                    onChange={handleSalonChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Salon Tagline</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    name="salonTag"
                    value={salonDetails.salonTag}
                    onChange={handleSalonChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Contact Email</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiMail className="text-gray-400" />
                  <input
                    type="email"
                    name="contactEmail"
                    value={salonDetails.contactEmail}
                    onChange={handleSalonChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Contact Number</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiPhone className="text-gray-400" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={salonDetails.contactNumber}
                    onChange={handleSalonChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Salon Image URL</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiImage className="text-gray-400" />
                  <input
                    type="url"
                    name="salonImgUrl"
                    value={salonDetails.salonImgUrl}
                    onChange={handleSalonChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {salonDetails.salonImgUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Salon Image Preview</p>
                <img 
                  src={salonDetails.salonImgUrl} 
                  alt="Salon Preview" 
                  className="w-full max-w-md rounded-xl object-cover h-48 border-4 border-purple-100"
                />
              </div>
            )}

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg"
                type="submit"
              >
                <FiSave />
                Save Salon Details
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;