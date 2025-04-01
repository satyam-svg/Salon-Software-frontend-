"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const FinancialManagement = () => {
  const financialMetrics = [
    {
      title: "Branch Revenue Overview",
      description: "Track earnings from multiple branches in real-time.",
      image: "/finacial1.png",
      gradient: "from-rose-400/20 to-amber-600/10"
    },
    {
      title: "Expense Monitoring",
      description: "Detailed breakdown of operational costs.",
      image: "/finacial2.jpg",
      gradient: "from-emerald-400/20 to-cyan-600/10"
    },
    {
      title: "Financial Reports & Taxes",
      description: "Automated reports for accounting compliance.",
      image: "/finacial3.png",
      gradient: "from-purple-400/20 to-pink-600/10"
    },
    {
      title: "AI Profit Insights",
      description: "Smart analytics to maximize profits.",
      image: "/finacial4.jpg",
      gradient: "from-blue-400/20 to-indigo-600/10"
    },
  ];

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, #b76e79, transparent 70%)`
        }}
      />

      {/* Micro Particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-rose-300/10 rounded-full"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Compact Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-rose-500">
            Financial Control
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Precision financial tools for salon business excellence
          </p>
        </motion.div>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {financialMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="group relative h-[280px] rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Image Container */}
              <div className="relative h-48">
                <Image
                  src={metric.image}
                  alt={metric.title}
                  fill
                  className="object-cover transform group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 bg-gradient-to-b from-black/40 to-transparent">
                <h3 className="text-lg font-semibold mb-2 text-rose-100">{metric.title}</h3>
                <p className="text-sm text-gray-300 leading-tight">{metric.description}</p>
              </div>

              {/* Hover Effects */}
              <div className={`absolute inset-0 border border-rose-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${metric.gradient}`} />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: `0 0 30px ${metric.gradient.split(' ')[0].replace('from-', '#').replace('/20', '30')}`
                }}
              />

              {/* Animated Indicator */}
              <motion.div
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-sm"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >
                💹
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Central Animation */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full mix-blend-overlay opacity-15"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: `conic-gradient(from 90deg, #b76e79, #d4a373, #b76e79)`
          }}
        />
      </div>
    </section>
  );
};

export default FinancialManagement;