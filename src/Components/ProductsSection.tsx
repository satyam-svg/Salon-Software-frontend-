"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";

  const features = [
    {
      title: "Inventory Management",
      description: "Track all your salon products, their stock levels, and restocking needs effortlessly.",
      image: "/inventry.png", // 3D isometric view of organized salon product shelves with digital overlay
    },
    {
      title: "Product Usage Tracking",
      description: "Monitor which products are used for different services and their consumption rates.",
      image: "/Product_Usage.png", // Abstract visualization of product flow between services with analytics
    },
    {
      title: "Service Pricing & Offerings",
      description: "Manage your services, set pricing, and update offers dynamically.",
      image: "/salon_dashbord.png", // Modern dashboard interface showing service cards with price adjustments
    },
    {
      title: "Stock Alerts & Insights",
      description: "Get notified when stock is low and receive valuable inventory insights.",
      image: "/inventry_management.png", // Mobile notification overlay on top of product inventory list
    },
    {
      title: "Multi-Branch Support",
      description: "Manage inventory across multiple locations seamlessly.",
      image: "/live_stoke.png", // Network map connecting multiple salon locations with real-time data
    },
    {
      title: "Automated Reports",
      description: "Generate reports on product usage, revenue, and salon performance.",
      image: "/analitik.png", // Data dashboard with charts and graphs in rose gold theme
    }
  ];

  return (
    <section 
      ref={ref}
      className="relative bg-black text-white py-28 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, ${roseGold}10 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        className="absolute inset-0 opacity-15"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${roseGold} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
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
            y: [0, 50, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`,
                textShadow: `0 0 30px ${roseGold}40`
              }}>
            Smart Product & Service Management
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Organize your salon inventory with ease. Track stock, usage, and availability, while managing your offered services with dynamic pricing & insights.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                delay: index * 0.15,
                duration: 0.6,
                ease: "backOut"
              }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                background: `linear-gradient(45deg, #1a1a1a, #2d1a22)`
              }}
              className="relative group p-1 rounded-3xl bg-gradient-to-br from-[#b76e7930] to-[#d4a37330] hover:shadow-xl hover:shadow-[#b76e7920] transition-all"
            >
              <div className="h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6">
                {/* Image Container */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-full h-48 rounded-xl overflow-hidden mb-6"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`
                    }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#b76e7940] transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;