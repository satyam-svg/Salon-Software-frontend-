"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const ResourceManagement = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";

  const features = [
    {
      title: 'Client Management',
      description: 'Add, edit, and track client details, including service history and spending.',
      image: '/resorses1.png',
      color: '#b76e79'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Effortlessly book, modify, or cancel client appointments with ease.',
      image: '/resorses2.jpg',
      color: '#d4a373'
    },
    {
      title: 'Revenue Insights',
      description: 'Analyze total earnings from clients and track financial performance.',
      image: '/resorses3.png',
      color: '#9d6b53'
    },
    {
      title: 'Staff Allocation',
      description: 'Assign appointments to staff based on availability for smooth operations.',
      image: '/resorses4.jpg',
      color: '#c58e6a'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative text-white py-20 md:py-28 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, ${roseGold}10 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    >
      {/* Animated Background Elements */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${roseGold} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#b76e79] rounded-full"
          style={{
            width: Math.random() * 5 + 2 + 'px',
            height: Math.random() * 5 + 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, 100, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 6 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Gradient Blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 w-[800px] h-[800px] opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${roseGold} 0%, transparent 60%)`
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute -bottom-40 -right-40 w-[800px] h-[800px] opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${lightRoseGold} 0%, transparent 60%)`
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent px-4 leading-tight md:leading-none"
              style={{
                backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`,
                textShadow: `0 0 30px ${roseGold}40`
              }}>
            Resource Optimization
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-black max-w-3xl mx-auto px-4">
            Streamline your salon operations with intelligent resource management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-12 px-4 sm:px-0">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group perspective-1000"
            >
              <motion.div
                whileHover={{ 
                  y: -15,
                  rotateZ: Math.random() * 4 - 2,
                  transition: { 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300,
                    damping: 10
                  } 
                }}
                className="relative h-full p-1 rounded-3xl bg-gradient-to-br from-[#b76e7930] to-[#d4a37330] hover:shadow-2xl hover:shadow-[#b76e7930] transition-all overflow-hidden"
              >
                <div className="h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6">
                  {/* Image Container */}
                  <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden mb-6">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 border border-white/5 rounded-xl" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`
                        }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity"
                       style={{
                         boxShadow: `0 0 80px 20px ${feature.color}40`
                       }} />
                </div>

                {/* Floating Border Animation */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10"
                  whileHover={{
                    borderColor: [`${feature.color}40`, `${feature.color}80`, `${feature.color}40`],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-[#b76e79] to-transparent" />
      </div>
    </section>
  );
};

export default ResourceManagement;