// components/StellarNavbar.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const StellarNavbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const roseGold = '#b76e79';
  const lightRoseGold = '#d4a373';
  const dimRoseGold = '#f8e9eb';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Products', path: '/products', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Services', path: '/services', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'About', path: '/about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Contact', path: '/contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  // Animation variants remain unchanged
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
  };

  const menuVariants = {
    open: { 
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200,
        damping: 25,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    closed: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  };

  const linkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Hamburger icon animation remains unchanged
  const topLine = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 7 },
  };

  const middleLine = {
    closed: { opacity: 1, y: 5 },
    open: { opacity: 0, y: 2 },
  };

  const bottomLine = {
    closed: { rotate: 0, y: 10 },
    open: { rotate: -45, y: -8 },
  };

  return (
    <>
    <style jsx global>{`
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
      `}</style>
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo remains unchanged */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.img 
              src="/logo.png" 
              alt="Logo" 
              className="h-9 w-9 lg:h-10 lg:w-10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.span
              className="text-2xl font-bold tracking-tight"
              style={{ color: roseGold, fontFamily: "'Dancing Script', cursive" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SalonSphere
            </motion.span>
          </Link>

          {/* Desktop Navigation with active link indicator */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={linkVariants}>
              <Link href={link.path} passHref>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className={`transition-colors duration-300 ${
                    pathname === link.path ? 'text-[#b76e79]' : 'text-gray-500 hover:text-[#b76e79]'
                  }`} style={{fontFamily:"IBM Plex Mono"}}>
                    {link.name}
                    <motion.span
                      className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                        pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      style={{ backgroundColor: roseGold }}
                    />
                  </p>
                </motion.div>
              </Link>
            </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ 
                background: `linear-gradient(to right, ${roseGold}, ${lightRoseGold})`,
                color: 'white'
              }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button remains unchanged */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg focus:outline-none"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <div className="w-7 h-7 relative flex items-center justify-center">
              <motion.span
                className="absolute block w-6 h-0.5 rounded-full"
                style={{ backgroundColor: roseGold }}
                variants={topLine}
                animate={isMenuOpen ? "open" : "closed"}
              />
              <motion.span
                className="absolute block w-6 h-0.5 rounded-full"
                style={{ backgroundColor: roseGold }}
                variants={middleLine}
                animate={isMenuOpen ? "open" : "closed"}
              />
              <motion.span
                className="absolute block w-6 h-0.5 rounded-full"
                style={{ backgroundColor: roseGold }}
                variants={bottomLine}
                animate={isMenuOpen ? "open" : "closed"}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu remains unchanged */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="lg:hidden fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4"
              >
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
                  style={{ boxShadow: `0 25px 50px -12px ${roseGold}20` }}>
                  
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-full hover:bg-rose-50 transition-colors"
                      style={{ color: roseGold }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex flex-col p-8 pt-14">
                    <motion.div 
                      className="mb-8 text-center"
                      variants={linkVariants}
                    >
                      <div className="inline-block p-4 rounded-2xl mb-4" style={{ backgroundColor: dimRoseGold }}>
                      <Image 
      src="/logo.png" 
      alt="Logo" 
      width={48}
      height={48}
      className="object-contain"
      priority
    />
                      </div>
                      <h3 className="text-2xl font-bold" style={{ color: roseGold,fontFamily: "'Dancing Script', cursive" }}>SalonSphere Menu</h3>
                    </motion.div>

                    <div className="flex flex-col space-y-4">
                      {navLinks.map((link) => (
                        <motion.div 
                          key={link.name} 
                          variants={linkVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <Link href={link.path} passHref>
                            <motion.div
                              className="group flex items-center px-6 py-4 rounded-xl hover:bg-rose-50 transition-all"
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <svg 
                                className="flex-shrink-0 w-6 h-6 mr-4" 
                                fill="none" 
                                stroke={roseGold} 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                              </svg>
                              <p className="text-lg font-medium text-gray-700 group-hover:text-rose-700">
                                {link.name}
                              </p>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-8 w-full px-6 py-4 rounded-xl text-lg font-semibold transition-all"
                        style={{ 
                          background: `linear-gradient(to right, ${roseGold}, ${lightRoseGold})`,
                          color: 'white',
                          boxShadow: `0 4px 24px ${roseGold}30`
                        }}
                      >
                        Get Started
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    </>
  );
};

export default StellarNavbar;