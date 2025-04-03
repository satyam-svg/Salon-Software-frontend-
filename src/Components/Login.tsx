'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FiMail, FiLock, FiUser, FiChevronRight, FiBriefcase, FiUsers, FiX } from 'react-icons/fi'
import { useLogin } from '@/context/LoginContext'
import { useSignup } from '@/context/SignupContext'

const LoginPopup = () => {
  const roseGold = '#b76e79'
  const lightRoseGold = '#d4a373'
  const [activeTab, setActiveTab] = useState<'owner' | 'staff'>('owner')
  const [isSubmitting, setIsSubmitting] = useState(false)


 // Hide when signupToggle is false
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    staffId: '',
    accessCode: ''
  })
  const { loginToggle, setLoginToggle } = useLogin();
  const { setSignupToggle} = useSignup();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      setIsSubmitting(false)
      alert(activeTab === 'owner' 
        ? `Welcome back, Luxury Owner!` 
        : `Staff access granted!`)
    }, 1500)
  }

  
  if (!loginToggle) return null;
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
        style={{ borderColor: `${roseGold}20` }}
      >
        {/* Close Button - Integrated with header */}
        <button 
          onClick={() => setLoginToggle(false)} 
          className="absolute top-4 right-4 z-50 p-2 hover:bg-rose-50/50 rounded-full transition-colors"
        >
          <motion.div
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="text-2xl text-rose-700/90 hover:text-rose-800" />
          </motion.div>
        </button>

        {/* Rose Gold Header */}
        <div 
          className="relative h-40 flex flex-col items-center justify-end pb-6 px-8"
          style={{ background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent" />
          <div className="absolute inset-0 opacity-10 pattern-diamonds pattern-white pattern-size-4" />
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">SalonSphere</h1>
            </div>
            <p className="text-white/90 text-sm font-light">Complete salon ecosystem</p>
          </motion.div>
          
          {/* Tabs with Icons */}
          <motion.div 
            className="flex gap-2 mt-6 relative bg-white/20 backdrop-blur-sm rounded-full p-1"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setActiveTab('owner')}
              className={`relative px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all z-10 ${
                activeTab === 'owner'
                  ? 'text-rose-800 bg-white/90 shadow-sm'
                  : 'text-white hover:text-white/90'
              }`}
            >
              <FiBriefcase className={activeTab === 'owner' ? 'text-rose-600' : 'text-white'} />
              Owner
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`relative px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all z-10 ${
                activeTab === 'staff'
                  ? 'text-rose-800 bg-white/90 shadow-sm'
                  : 'text-white hover:text-white/90'
              }`}
            >
              <FiUsers className={activeTab === 'staff' ? 'text-rose-600' : 'text-white'} />
              Staff
            </button>
          </motion.div>
        </div>

        {/* Form Area */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {activeTab === 'owner' ? (
                <motion.div
                  key="owner-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Professional Email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="staff-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiUser className="text-lg" />
                    </div>
                    <input
                      name="staffId"
                      type="text"
                      value={formData.staffId}
                      onChange={handleChange}
                      placeholder="Staff ID"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      name="accessCode"
                      type="password"
                      value={formData.accessCode}
                      onChange={handleChange}
                      placeholder="Access Code"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-200 h-4 w-4" 
                />
                Remember me
              </label>
              <a href="#" className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                Forgot {activeTab === 'owner' ? 'Password?' : 'Code?'}
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all mt-4
                ${
                  isSubmitting
                    ? 'bg-rose-300 cursor-not-allowed'
                    : `text-white shadow-md hover:shadow-rose-200/50`
                }`}
              style={{
                background: isSubmitting 
                  ? '#b76e79' 
                  : `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`
              }}
            >
              <span className="font-medium">
                {isSubmitting ? (
                  'Authenticating...'
                ) : (
                  <>
                    {activeTab === 'owner' ? 'Owner Access' : 'Staff Portal'}
                  </>
                )}
              </span>
              {!isSubmitting && (
                <FiChevronRight className="text-white" />
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm text-gray-600 pt-4 border-t border-gray-100"
          >
            {activeTab === 'owner' ? (
              <p>
                New luxury partner?{' '}
                <button
                  onClick={()=>{setLoginToggle(false); setSignupToggle(true)}}
                  className="text-rose-600 hover:text-rose-700 font-medium focus:outline-none"
                >
                  Join our elite circle
                </button>
              </p>
            ) : (
              <p>
                Need staff credentials?{' '}
                <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                  Contact management
                </a>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPopup