'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FiMail, FiLock, FiChevronRight, FiX, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'
import { useForgetPassword } from '@/context/ForgetpassContext'

const ForgotPassword = () => {
  const roseGold = '#b76e79'
  const lightRoseGold = '#d4a373'
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'password'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sentOtp, setSentOtp] = useState<string | null>(null)
  const { setForgetPasswordToggle } = useForgetPassword();
 

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Mock OTP generation
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setSentOtp(generatedOtp)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCurrentStep('otp')
      toast.success('OTP sent to your email!', {
        icon: <FiCheckCircle className="text-green-500" />,
        style: {
          background: '#f5f0f0',
          color: '#b76e79',
          border: '1px solid #e7d4d6'
        }
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = () => {
    if (otp === sentOtp) {
      setCurrentStep('password')
    } else {
      toast.error('Invalid OTP code')
    }
  }

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Simulate password reset API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Password updated successfully!', {
        icon: <FiCheckCircle className="text-green-500" />,
        style: {
          background: '#f5f0f0',
          color: '#b76e79',
          border: '1px solid #e7d4d6'
        }
      })
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Password reset failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)



  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'font-medium text-sm',
          duration: 3000,
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={() => setForgetPasswordToggle(false)} 
          className="absolute top-4 right-4 z-50 p-2 hover:bg-rose-50/50 rounded-full transition-colors"
        >
          <motion.div whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FiX className="text-2xl text-rose-700/90 hover:text-rose-800" />
          </motion.div>
        </button>

        <div 
          className="relative h-32 flex flex-col items-center justify-end pb-6 px-8"
          style={{ background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})` }}
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/90 text-sm font-light">Secure account recovery process</p>
          </motion.div>
        </div>

        <div className="p-8 pt-6">
          <div className="space-y-5">
            {currentStep !== 'email' && (
              <button
                onClick={() => setCurrentStep(prev => 
                  prev === 'password' ? 'otp' : 'email'
                )}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm"
              >
                <FiArrowLeft className="inline-block" />
                Back to {currentStep === 'otp' ? 'email' : 'OTP verification'}
              </button>
            )}

            <AnimatePresence mode="wait">
              {currentStep === 'email' ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Registered email address"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendOtp}
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                      ${isSubmitting ? 'bg-rose-300 cursor-not-allowed' : 'text-white shadow-md hover:shadow-rose-200/50'}`}
                    style={{
                      background: isSubmitting 
                        ? '#e5d8da' 
                        : `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 rounded-full border-t-white animate-spin" />
                        Sending OTP...
                      </span>
                    ) : (
                      <>
                        Send OTP
                        <FiChevronRight className="text-white" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : currentStep === 'otp' ? (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                      ${isSubmitting ? 'bg-rose-300 cursor-not-allowed' : 'text-white shadow-md hover:shadow-rose-200/50'}`}
                    style={{
                      background: isSubmitting 
                        ? '#e5d8da' 
                        : `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 rounded-full border-t-white animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify OTP
                        <FiChevronRight className="text-white" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="password-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-rose-500 transition-colors">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePasswordReset}
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                      ${isSubmitting ? 'bg-rose-300 cursor-not-allowed' : 'text-white shadow-md hover:shadow-rose-200/50'}`}
                    style={{
                      background: isSubmitting 
                        ? '#e5d8da' 
                        : `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 rounded-full border-t-white animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      <>
                        Reset Password
                        <FiChevronRight className="text-white" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword