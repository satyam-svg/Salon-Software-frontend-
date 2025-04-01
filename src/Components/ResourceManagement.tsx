"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

const ResourceManagement = () => {
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
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
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
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-rose-500">
            Resource Optimization
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Streamline your salon operations with intelligent resource management
          </p>
        </motion.div>

        {/* Compact Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative h-[320px] rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
            >
              {/* Image Container */}
              <div className="relative h-2/3">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
                <motion.div
                  className="backdrop-blur-sm rounded-lg p-4"
                  initial={{ y: 20 }}
                  whileInView={{ y: 0 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-rose-100">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              </div>

              {/* Hover Effects */}
              <div className="absolute inset-0 border border-rose-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: `0 0 40px ${feature.color}30`
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Animated Connectors */}
        <motion.div
          className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              fill="none"
              stroke="#b76e7930"
              strokeWidth="2"
              strokeDasharray="5 8"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default ResourceManagement;