// components/LuxuryFooter.tsx
'use client';

import { useEffect, useRef } from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { motion, useAnimation, useInView } from 'framer-motion';


const LuxuryFooter = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const socialVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      color: "#b76e79",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: "#b76e79",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(183, 110, 121, 0.4)",
      transition: {
        yoyo: Infinity,
        duration: 0.3
      }
    }
  };

  return (
    <>
     <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
      `}</style>
    <motion.footer 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="relative bg-[#fff9f7] pt-32 pb-16 overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#e8c4c0 0.5px, transparent 0.5px)",
        backgroundSize: "15px 15px"
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
        <svg 
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-[#b76e79] opacity-20"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            className="fill-[#b76e79] opacity-25"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-[#b76e79] opacity-30"
          />
        </svg>
      </div>

      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-[#e8c4c0] opacity-20 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-[#b76e79] opacity-20 mix-blend-multiply filter blur-xl animate-blob"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20"
          variants={containerVariants}
        >
          {/* Salon Brand Column */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="font-playfair text-3xl text-[#b76e79] mb-6 relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-[#e8c4c0]"
              style={{fontFamily: "'Dancing Script', cursive" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              SalonSphere
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Where beauty meets elegance. Experience luxury like never before with our premium salon services.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, staggerChildren: 0.1 }}
            >
              {[FaInstagram, FaFacebookF, FaTwitter, FaPinterestP].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-600 text-xl p-2 rounded-full bg-white bg-opacity-50 backdrop-blur-sm"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants}>
            <motion.h4 
              className="font-semibold text-gray-700 uppercase tracking-wider mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Quick Links
            </motion.h4>
            <motion.nav 
              className="space-y-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4
                  }
                }
              }}
            >
              {['About Us', 'Services', 'Gallery', 'Testimonials', 'Careers'].map((link, index) => (
                <motion.a
                  key={link}
                  href="#"
                  className="block text-gray-600 hover:text-[#b76e79] transition-colors duration-300 group flex items-start"
                  variants={linkVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <span className="inline-block mr-2 text-[#b76e79] opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                  {link}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>

          {/* Services Column */}
          <motion.div variants={itemVariants}>
            <motion.h4 
              className="font-semibold text-gray-700 uppercase tracking-wider mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Our Services
            </motion.h4>
            <motion.nav 
              className="space-y-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4
                  }
                }
              }}
            >
              {[
                'Bridal Makeup',
                'Hair Extensions',
                'Spa Treatments',
                'Nail Artistry',
                'Skincare Facials',
                'Hair Coloring'
              ].map((service, index) => (
                <motion.a
                  key={service}
                  href="#"
                  className="block text-gray-600 hover:text-[#b76e79] transition-colors duration-300 group flex items-start"
                  variants={linkVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <span className="inline-block mr-2 text-[#b76e79] opacity-0 group-hover:opacity-100 transition-all duration-300">✦</span>
                  {service}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>

          {/* Contact & Newsletter Column */}
          <motion.div variants={itemVariants}>
            <motion.h4 
              className="font-semibold text-gray-700 uppercase tracking-wider mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Contact Us
            </motion.h4>
            <motion.div 
              className="space-y-4 mb-8"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4
                  }
                }
              }}
            >
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ x: 3 }}
              >
                <FaMapMarkerAlt className="text-[#b76e79] mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">123 Beauty Ave, Glamour City</span>
              </motion.div>
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ x: 3 }}
              >
                <FaPhone className="text-[#b76e79] mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </motion.div>
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ x: 3 }}
              >
                <FaEnvelope className="text-[#b76e79] mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">hello@eclatsalon.com</span>
              </motion.div>
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ x: 3 }}
              >
                <FaClock className="text-[#b76e79] mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">Mon-Sat: 9AM - 8PM</span>
              </motion.div>
            </motion.div>

            <motion.h4 
              className="font-semibold text-gray-700 uppercase tracking-wider mb-4 text-lg mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Newsletter
            </motion.h4>
            <motion.p 
              className="text-gray-600 mb-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Subscribe to get updates on special offers and beauty tips.
            </motion.p>
            <motion.form 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 border border-[#e8c4c0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent bg-white bg-opacity-50 backdrop-blur-sm"
              />
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white py-3 rounded-full font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>

        {/* Copyright Section */}
        <motion.div 
          className="border-t border-[#e8c4c0] pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SalonSphere. All rights reserved.
          </div>
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-600 hover:text-[#b76e79] text-sm"
                whileHover={{ 
                  scale: 1.05,
                  color: "#b76e79"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div 
        className="absolute bottom-10 right-10 text-[#e8c4c0] text-4xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✦
      </motion.div>
      <motion.div 
        className="absolute top-1/4 left-5 text-[#b76e79] text-2xl opacity-70"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        ❀
      </motion.div>
    </motion.footer>
    </>
  );
};

export default LuxuryFooter;