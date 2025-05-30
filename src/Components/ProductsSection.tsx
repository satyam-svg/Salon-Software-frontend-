"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const ProductsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";

  const features = [
    {
      title: "Inventory Management",
      description: "Track all your salon products, their stock levels, and restocking needs effortlessly.",
      image: "/inventry.png",
    },
    {
      title: "Product Usage Tracking",
      description: "Monitor which products are used for different services and their consumption rates.",
      image: "/Product_Usage.png",
    },
    {
      title: "Service Pricing & Offerings",
      description: "Manage your services, set pricing, and update offers dynamically.",
      image: "/salon_dashbord.png",
    },
    {
      title: "Stock Alerts & Insights",
      description: "Get notified when stock is low and receive valuable inventory insights.",
      image: "/inventry_management.png",
    },
    {
      title: "Multi-Branch Support",
      description: "Manage inventory across multiple locations seamlessly.",
      image: "/live_stoke.png",
    },
    {
      title: "Automated Reports",
      description: "Generate reports on product usage, revenue, and salon performance.",
      image: "/analitik.png",
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
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        className="absolute inset-0 opacity-15"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${roseGold} 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

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
          initial={{ y: 0, opacity: 0 }}
          animate={isInView ? {
            y: [0, 100, 0],
            opacity: [0.3, 0.8, 0.3],
          } : {}}
          transition={{
            duration: Math.random() * 6 + 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={isInView ? { scale: 1, rotate: 360 } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 w-[800px] h-[800px] opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${roseGold} 0%, transparent 60%)`
        }}
      />
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={isInView ? { scale: 1, rotate: -180 } : {}}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute -bottom-40 -right-40 w-[800px] h-[800px] opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${lightRoseGold} 0%, transparent 60%)`
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent px-4 leading-tight md:leading-none"
              style={{
                backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`,
                textShadow: `0 0 30px ${roseGold}40`
              }}>
            Smart Product &<br className="hidden lg:block" /> Service Management
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg lg:text-xl text-black max-w-3xl mx-auto px-4"
          >
            Organize your salon inventory with ease. Track stock, usage, and availability, while managing your offered services with dynamic pricing & insights.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 px-4 sm:px-0">
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
                  <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden mb-6">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                      style={{ transform: 'translateZ(0)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 border border-white/5 rounded-xl" />
                  </div>

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

                  <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity"
                       style={{
                         boxShadow: `0 0 80px 20px ${roseGold}40`
                       }} />
                </div>

                <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10" />
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 1.5, ease: "circOut" }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-[#b76e79] to-transparent"
        />
      </div>
    </section>
  );
};

export default ProductsSection;