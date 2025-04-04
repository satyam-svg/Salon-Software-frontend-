'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { FiMail, FiLock, FiChevronRight, FiX, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'
import { useForgetPassword } from '@/context/ForgetpassContext'

const ForgotPassword = () => {
  const roseGold = '#b76e79'
  const lightRoseGold = '#d4a373'
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'password'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sentOtp, setSentOtp] = useState<string | null>(null)
  const { setForgetPasswordToggle } = useForgetPassword();

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  })

  // Check password requirements on change
  useEffect(() => {
    if (currentStep === 'password') {
      setPasswordRequirements({
        hasMinLength: newPassword.length >= 8,
        hasUpperCase: /[A-Z]/.test(newPassword),
        hasLowerCase: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
      })
    }
  }, [newPassword, currentStep])

  useEffect(() => {
    setEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
    setSentOtp(null)
    setCurrentStep('email')
  }, [])

  const sendOtpRequest = async (email: string) => {
    try {
      const response = await fetch('https://salon-backend-3.onrender.com/api/email/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: email }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP')

      setSentOtp(data.otp.toString())
      return true
    } catch (error) {
      throw error
    }
  }

  const handleSendOtp = async () => {
    const cleanedEmail = email.trim()
    if (!validateEmail(cleanedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setIsSubmitting(true)
    try {
      await sendOtpRequest(cleanedEmail)
      setCurrentStep('otp')
      toast.success('OTP sent to your email! 📧', {
        icon: <FiCheckCircle className="text-green-500" />,
        style: {
          background: '#f5f0f0',
          color: '#b76e79',
          border: '1px solid #e7d4d6'
        },
        duration: 4000
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    const cleanedEmail = email.trim()
    if (!validateEmail(cleanedEmail)) return
    
    setIsResendingOtp(true)
    try {
      await sendOtpRequest(cleanedEmail)
      toast.success('New OTP sent to your email! 📧', {
        icon: <FiCheckCircle className="text-green-500" />,
        style: {
          background: '#f5f0f0',
          color: '#b76e79',
          border: '1px solid #e7d4d6'
        },
        duration: 4000
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP'
      toast.error(errorMessage)
    } finally {
      setIsResendingOtp(false)
    }
  }

  const handleVerifyOtp = useCallback(() => {
    if (otp === sentOtp) {
      setCurrentStep('password')
    } else {
      toast.error('Invalid OTP code ❌', {
        duration: 3000
      })
    }
  }, [otp, sentOtp])

  useEffect(() => {
    if (otp.length === 6 && sentOtp !== null) handleVerifyOtp()
  }, [otp, sentOtp, handleVerifyOtp])

  const validatePassword = () => {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long', { duration: 3000 })
      return false
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error('Password must contain at least one uppercase letter', { duration: 3000 })
      return false
    }
    if (!/[a-z]/.test(newPassword)) {
      toast.error('Password must contain at least one lowercase letter', { duration: 3000 })
      return false
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error('Password must contain at least one number', { duration: 3000 })
      return false
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      toast.error('Password must contain at least one special character', { duration: 3000 })
      return false
    }
    return true
  }

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match 🔒', {
        duration: 3000
      })
      return
    }

    if (!validatePassword()) {
      return
    }
    
    setIsSubmitting(true)
    try {
      // Password reset request
      const resetResponse = await fetch('https://salon-backend-3.onrender.com/api/users/forgetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          newPassword
        }),
      })

      if (!resetResponse.ok) {
        const errorData = await resetResponse.json()
        throw new Error(errorData.message || 'Password reset failed')
      }

      // Email confirmation request
      const emailPromise = fetch('https://salon-backend-3.onrender.com/api/email/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      await toast.promise(
        emailPromise,
        {
          loading: 'Sending confirmation email... 📧',
          success: () => {
            return (
              <div>
                <span className="block">Password reset successful! 🔒</span>
                <span className="block mt-1">Confirmation email sent 📧</span>
              </div>
            )
          },
          error: (error) => {
            console.error('Email error:', error)
            return 'Password reset successful, but confirmation email failed 📧'
          }
        },
        {
          style: {
            background: '#f5f0f0',
            color: '#b76e79',
            border: '1px solid #e7d4d6',
            maxWidth: '500px'
          },
          success: { duration: 5000 },
          error: { duration: 5000 }
        }
      )

      // Only close after email is sent
      setForgetPasswordToggle(false)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      toast.error(errorMessage, {
        duration: 4000
      })
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
                      autoComplete="new-email"
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
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all border border-gray-200 text-gray-800 placeholder-gray-400"
                      required
                      autoComplete="one-time-code"
                    />
                    {otp.length === 6 && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {otp === sentOtp ? (
                          <FiCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FiXCircle className="text-red-500 text-xl" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleResendOtp}
                      disabled={isResendingOtp}
                      className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      {isResendingOtp ? (
                        <>
                          <FiRefreshCw className="animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <FiRefreshCw />
                          Resend OTP
                        </>
                      )}
                    </button>

                    {(otp.length !== 6 || otp !== sentOtp) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerifyOtp}
                        disabled={isSubmitting || otp.length !== 6}
                        className={`py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                          ${isSubmitting || otp.length !== 6 ? 'bg-gray-200 cursor-not-allowed' : 'text-white shadow-md hover:shadow-rose-200/50'}`}
                        style={{
                          background: (isSubmitting || otp.length !== 6) 
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
                    )}
                  </div>
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
                    />
                  </div>

                  {/* Password requirements checklist */}
                  <div className="bg-rose-50/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-rose-800 mb-2">Password must contain:</h4>
                    <ul className="space-y-1 text-xs text-rose-700">
                      <li className={`flex items-center ${passwordRequirements.hasMinLength ? 'text-green-600' : ''}`}>
                        {passwordRequirements.hasMinLength ? (
                          <FiCheckCircle className="mr-2" />
                        ) : (
                          <FiXCircle className="mr-2" />
                        )}
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-600' : ''}`}>
                        {passwordRequirements.hasUpperCase ? (
                          <FiCheckCircle className="mr-2" />
                        ) : (
                          <FiXCircle className="mr-2" />
                        )}
                        At least one uppercase letter (A-Z)
                      </li>
                      <li className={`flex items-center ${passwordRequirements.hasLowerCase ? 'text-green-600' : ''}`}>
                        {passwordRequirements.hasLowerCase ? (
                          <FiCheckCircle className="mr-2" />
                        ) : (
                          <FiXCircle className="mr-2" />
                        )}
                        At least one lowercase letter (a-z)
                      </li>
                      <li className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : ''}`}>
                        {passwordRequirements.hasNumber ? (
                          <FiCheckCircle className="mr-2" />
                        ) : (
                          <FiXCircle className="mr-2" />
                        )}
                        At least one number (0-9)
                      </li>
                      <li className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-600' : ''}`}>
                        {passwordRequirements.hasSpecialChar ? (
                          <FiCheckCircle className="mr-2" />
                        ) : (
                          <FiXCircle className="mr-2" />
                        )}
                        At least one special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePasswordReset}
                    disabled={isSubmitting || !Object.values(passwordRequirements).every(Boolean)}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                      ${isSubmitting || !Object.values(passwordRequirements).every(Boolean) ? 'bg-rose-300 cursor-not-allowed' : 'text-white shadow-md hover:shadow-rose-200/50'}`}
                    style={{
                      background: isSubmitting || !Object.values(passwordRequirements).every(Boolean)
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