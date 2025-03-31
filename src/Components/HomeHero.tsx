"use client";

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
const HomeHero = () => {
  const [mounted, setMounted] = useState(false);
  const [perspective, setPerspective] = useState(420);
  const [mobileview, setMobileview] = useState(false);
  const roseGold = '#b76e79';
  const lightRoseGold = '#d4a373';
  
  // Mouse interaction values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  useEffect(() => {
    setMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.screen.width);
      mouseY.set(e.clientY / window.screen.height);
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const galleryImages = [
    '/salon.png',
    '/Client.png',
    '/Staff.png',
    '/dashboard.png',
    '/appointment.png',
    '/Feedback.png',
    '/Finance.png',
    '/branch.png'
  ];

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent running on server
  
    setMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
  
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's running on client
  
    const updatePerspective = () => {
      const screenWidth = window.innerWidth;
  
      setPerspective(screenWidth <= 1280 ? 600 : 420);
      setMobileview(screenWidth <= 1000);
    };
  
    updatePerspective();
    window.addEventListener("resize", updatePerspective);
  
    return () => window.removeEventListener("resize", updatePerspective);
  }, []);
    


  if (!mounted) return null;

  return (
    <section className="relative h-[100dvh] max-h-[900px] bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at center, ${roseGold} 0%, transparent 70%)`
        }}
      />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
        <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-4 lg:gap-8 xl:gap-12">
          {/* Left Content */}
          <motion.div 
            className="relative w-full lg:w-1/2 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-[8vw] sm:text-[6vw] md:text-[5vw] lg:text-[4vw] font-bold mb-2 lg:mb-4 leading-[1.1]">
              {["Create", "Your Own", "Salon Ecosystem"].map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 + 1 }}
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.2vw] text-gray-300 mb-4 lg:mb-8 max-w-full lg:max-w-[90%]">
              Transform your beauty business with our all-in-one platform integrating 
              <span className="text-rose-300"> management, bookings, and community</span>. 
              Elevate your salon to celestial heights.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-[4vw] py-[1.5vw] lg:px-[2vw] lg:py-[1vw] rounded-full text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.2vw] font-semibold transition-all relative overflow-hidden group w-fit mx-auto lg:mx-0"
              style={{
                background: `linear-gradient(45deg, ${roseGold}, ${lightRoseGold})`,
                boxShadow: `0 0 40px ${roseGold}40`
              }}>
              <span className="relative z-10">Launch Your Ecosystem</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>

          {/* 3D Gallery Container */}
          <motion.div 
            className="relative w-full lg:w-1/2 h-[30vh] lg:h-[50vh] flex items-center justify-center"
            style={{
              perspective: `${perspective}px`,
              rotateX,
              rotateY,
            }}
           
          >
            {!mobileview && 
                    <motion.div
                    className="gallery-container"
                    animate={{ rotateY: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Inside your gallery mapping function */}
      {galleryImages.map((img, i) => (
        <motion.div
          key={i}
          className="gallery-item"
          style={{ 
            '--i': i+1,
            transform: `rotateY(calc(var(--i) * 45deg)) translateZ(calc(min(20vw, 200px)))`,
          } as React.CSSProperties}
        >
          <Image
            src={img}
            alt={`Gallery image ${i+1}`}
            className="gallery-image"
            width={200}  // Set explicit width
            height={300} // Set explicit height
            loading={i < 3 ? "eager" : "lazy"} // First 3 load eagerly, rest lazy load
            priority={i < 2} // Highest priority for first 2 images
            quality={85} // Good balance between quality and size
            placeholder="blur" // Add blur placeholder
            blurDataURL={`data:image/svg+xml;base64,[YOUR_BASE64_PLACEHOLDER]`}
          />
          <div className="gallery-overlay" />
        </motion.div>
      ))}
                  </motion.div>
            }

          </motion.div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .gallery-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          display: flex;
          justify-content: center;
          align-items: center;
          
        }

        .gallery-item {
          position: absolute;
           width: calc(min(15vw, 150px));  /* Reduced width */
  height: calc(min(22vw, 220px)); /* Reduced height */
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.05);
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .gallery-item {
            width: calc(min(70vw, 180px));
            height: calc(min(35vw, 250px));
            transform: rotateY(calc(var(--i) * 45deg)) translateZ(calc(min(25vw, 250px))) !important;
          }
        }

        @media (max-width: 768px) {
          .gallery-item {
            width: calc(min(30vw, 150px));
            height: calc(min(40vw, 200px));
            transform: rotateY(calc(var(--i) * 45deg)) translateZ(calc(min(20vw, 200px))) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeHero;