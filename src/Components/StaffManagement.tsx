"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const StaffManagement = () => {
  const features = [
    {
      title: 'Salary & Payments',
      description: 'Easily manage staff salaries, automate payments, and track payroll history.',
      image: '/staff1.png',
      color: '#b76e79'
    },
    {
      title: 'Attendance Tracking',
      description: 'Monitor staff attendance, leaves, and working hours seamlessly.',
      image: '/staff2.jpg',
      color: '#d4a373'
    },
    {
      title: 'Shift Scheduling',
      description: 'Create and assign shifts effortlessly, ensuring smooth operations.',
      image: '/staff3.png',
      color: '#9d6b53'
    },
    {
      title: 'Performance Insights',
      description: 'Analyze staff performance with detailed reports and analytics.',
      image: '/staff4.jpg',
      color: '#c58e6a'
    }
  ];

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, #b76e79, transparent 70%)`
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-rose-300/10 rounded-full"
          style={{
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        {/* Animated Header */}
        <div className="text-center mb-20 overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-rose-500">
              Staff Excellence
            </span>
            <br />
            <motion.span 
              className="text-2xl md:text-3xl font-light text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Empower Your Team with Intelligent Management
            </motion.span>
          </motion.h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative group perspective-1000"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              {/* Card Container */}
              <div className="relative h-full transform-style-preserve-3d group-hover:rotate-x-10 group-hover:rotate-y-10 transition-transform duration-500 ease-out">
                {/* Front Side */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl backface-hidden transform-style-preserve-3d">
                  {/* Hover Border */}
                  <div className="absolute inset-0 rounded-3xl border border-rose-900/30 group-hover:border-rose-400/50 transition-all duration-500" />
                  
                  {/* Image Container */}
                  <motion.div 
                    className="relative h-48 mb-6 rounded-xl overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-rose-100">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: `0 0 40px ${feature.color}40`
                    }}
                  />
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl p-8 shadow-2xl backface-hidden transform rotate-y-180 transform-style-preserve-3d">
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="text-4xl mb-4">📈</div>
                    <button className="px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Decorative Elements */}
        <motion.div
          className="absolute left-1/4 top-40 -translate-y-1/2 mix-blend-overlay opacity-30"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 100 100" className="w-64 h-64">
            <circle cx="50" cy="50" r="45" stroke="#b76e79" strokeWidth="2" fill="none" 
              strokeDasharray="4 8" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default StaffManagement;