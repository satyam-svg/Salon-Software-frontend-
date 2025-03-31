// components/HomeHero.tsx
"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HomeHero = () => {
  const [mounted, setMounted] = useState(false);
  const roseGold = '#b76e79';
  const lightRoseGold = '#d4a373';
  
  useEffect(() => setMounted(true), []);

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 + 1 }
    })
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at center, ${roseGold} 0%, transparent 70%)`
        }}
      />

      {/* Floating Logo */}
      <motion.img
        src="/logo.png"
        alt="Decorative logo"
        className="absolute opacity-5 w-[800px] h-[800px] -top-40 -right-60"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Animated Tagline */}
            <div className="relative inline-block">
              <svg
                viewBox="0 0 500 100"
                className="absolute -top-20 -left-20 w-[600px] h-[200px]"
              >
                <motion.path
                  d="M20,80 Q100,10 180,80 T340,20 L460,60"
                  fill="none"
                  stroke={roseGold}
                  strokeWidth="2"
                  variants={pathVariants}
                  initial="hidden"
                  animate="visible"
                />
              </svg>

              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                {["Create", "Your Own", "Salon Ecosystem"].map((word, i) => (
                  <motion.span
                    key={word}
                    custom={i}
                    variants={taglineVariants}
                    initial="hidden"
                    animate="visible"
                    className="block bg-gradient-to-r from-rose-200 to-rose-400 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl"
            >
              Transform your beauty business with our all-in-one platform integrating 
              <span className="text-rose-300"> management, bookings, and community</span>. 
              Elevate your salon to celestial heights.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full text-xl font-semibold transition-all relative overflow-hidden group"
              style={{
                background: `linear-gradient(45deg, ${roseGold}, ${lightRoseGold})`,
                boxShadow: `0 0 40px ${roseGold}40`
              }}
            >
              <span className="relative z-10">Launch Your Ecosystem</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>

          {/* Right Image Container */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            {/* Main Image Placeholder */}
            <div className="relative rounded-3xl overflow-hidden transform perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/30 to-rose-400/20" />
              <img
                src="/salon-ecosystem-image.png" // Replace with your generated image
                alt="Salon ecosystem visualization"
                className="w-full h-[600px] object-cover scale-[1.03] group-hover:scale-100 transition-transform duration-700"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-8 -left-12">
              <div className="relative w-48 h-48">
                <motion.img
                  src="/salon-team-image.jpeg" // Replace
                  alt="Team collaboration"
                  className="absolute rounded-2xl shadow-xl border-2 border-rose-900/50"
                  initial={{ y: 0 }}
                  animate={{ y: [-10, 10, -10] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-rose-500/20"
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeHero;