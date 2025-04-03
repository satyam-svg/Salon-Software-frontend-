'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { FiMail, FiLock, FiUser, FiChevronRight, FiX, FiCamera, FiEye, FiEyeOff } from 'react-icons/fi'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { useSignup } from '@/context/SignupContext'
import { useLogin } from '@/context/LoginContext'

const Signup = () => {
  const roseGold = '#b76e79'
  const lightRoseGold = '#d4a373'
  const { setLoginToggle } = useLogin();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const { signupToggle, setSignupToggle } = useSignup();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    onDrop,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Welcome to LuxeSalon Suite!')
    }, 1500)
  }
  if(!signupToggle){
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
        style={{ 
          borderColor: `${roseGold}20`,
          maxHeight: 'calc(100vh - 40px)',
          margin: '20px 0'
        }}
      >
        <button
          onClick={()=>{setSignupToggle(false)}}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Rose Gold Header */}
        <div 
          className="relative h-32 flex flex-col items-center justify-end pb-4 px-6"
          style={{ background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent" />
          <div className="absolute inset-0 opacity-10 pattern-diamonds pattern-white pattern-size-4" />
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">SalonSphere</h1>
            </div>
            <p className="text-white/90 text-xs font-light">Complete Salon ecosystem</p>
          </motion.div>
        </div>

        {/* Form Area */}
        <div className="p-6 pt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Upload */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-3"
            >
              <div {...getRootProps()} className="group cursor-pointer relative">
                <input {...getInputProps()} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full bg-rose-100/20 border-2 border-dashed border-rose-200 flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:border-rose-300"
                >
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FiCamera className="w-5 h-5 text-rose-200/80" />
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiCamera className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
                {profileImage && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-1 -right-1 bg-white/90 p-1 rounded-full shadow-sm border border-rose-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileImage(null)
                    }}
                  >
                    <FiX className="w-3 h-3 text-rose-400" />
                  </motion.button>
                )}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <FiUser className="text-base" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <FiMail className="text-base" />
                  </div>
                  <input
                    type="email"
                    placeholder="Business Email"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <FiLock className="text-base" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                    <FiLock className="text-base" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="terms"
                className="rounded border-gray-300 text-rose-500 focus:ring-rose-200 h-3.5 w-3.5" 
                required
              />
              <label htmlFor="terms" className="text-gray-600 text-xs cursor-pointer">
                I agree to the <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">Terms & Conditions</a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-all mt-3 text-sm
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
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="h-3.5 w-3.5 border-2 border-white/30 rounded-full border-t-white animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  Become a Partner
                  <FiChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-xs text-gray-600 pt-3 border-t border-gray-100"
          >
            <p>
              Already have an account?{' '}
              <button
                onClick={()=>{setSignupToggle(false); setLoginToggle(true)}}
                className="text-rose-600 hover:text-rose-700 font-medium focus:outline-none"
              >
                Access your suite
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup