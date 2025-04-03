'use client'

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { FiMail, FiLock, FiUser, FiChevronRight, FiX, FiCamera, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'
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
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const { signupToggle, setSignupToggle } = useSignup();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setProfileImageFile(file)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!profileImageFile) {
        throw new Error('Please upload a profile image')
      }

      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const fullname = formData.get('fullname') as string
      const email = formData.get('email') as string
      const contact = formData.get('contact') as string
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Upload image to Cloudinary
      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append('file', profileImageFile)
      cloudinaryFormData.append('upload_preset', 'salon_preset')

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dl1lqotns/image/upload`,
        { method: 'POST', body: cloudinaryFormData }
      )

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json()
        throw new Error(errorData.error.message || 'Image upload failed')
      }

      const cloudinaryData = await cloudinaryResponse.json()
      const profileImgUrl = cloudinaryData.secure_url

      // Submit user data to backend
      const userResponse = await fetch('https://salon-backend-2.onrender.com/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          email,
          contact,
          password,
          profile_img: profileImgUrl
        }),
      })

      const userData = await userResponse.json()

      if (!userResponse.ok) {
        throw new Error(userData.message || 'Signup failed')
      }

      console.log('Signup successful:', userData)
      alert('Welcome to LuxeSalon Suite!')
      setSignupToggle(false)
    } catch (error) {
      console.error('Signup error:', error)
      alert(error || 'An error occurred during signup')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!signupToggle) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={() => setSignupToggle(false)} 
          className="absolute top-4 right-4 z-50 p-2 hover:bg-rose-50/50 rounded-full"
        >
          <motion.div whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FiX className="text-2xl text-rose-700/90" />
          </motion.div>
        </button>

        <div className="relative h-32 flex flex-col items-center justify-end pb-4 px-6"
          style={{ background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})` }}>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-xl font-bold text-white">SalonSphere</h1>
            <p className="text-white/90 text-xs font-light">Complete Salon ecosystem</p>
          </motion.div>
        </div>

        <div className="p-6 pt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div className="flex justify-center mb-3">
              <div {...getRootProps()} className="group cursor-pointer relative">
                <input {...getInputProps()} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full bg-rose-100/20 border-2 border-dashed border-rose-200 flex items-center justify-center relative overflow-hidden"
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
                </motion.div>
              </div>
            </motion.div>

            <div className="space-y-3">
              <div className="relative group">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
              </div>

              <div className="relative group">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Business Email"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
              </div>

              <div className="relative group">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="contact"
                  type="text"
                  placeholder="Contact Number"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>

              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 rounded-lg focus:ring-2 focus:ring-rose-300 border border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="terms"
                className="rounded border-gray-300 text-rose-500 focus:ring-rose-200 h-3.5 w-3.5" 
                required
              />
              <label htmlFor="terms" className="text-gray-600 text-xs">
                I agree to the <a href="#" className="text-rose-600 font-medium">Terms & Conditions</a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-1 text-white shadow-md mt-3 text-sm"
              style={{
                background: `linear-gradient(135deg, ${roseGold}, ${lightRoseGold})`,
                opacity: isSubmitting ? 0.7 : 1
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

          <div className="mt-4 text-center text-xs text-gray-600 pt-3 border-t border-gray-100">
            <p>
              Already have an account?{' '}
              <button
                onClick={() => { setSignupToggle(false); setLoginToggle(true) }}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                Access your suite
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup