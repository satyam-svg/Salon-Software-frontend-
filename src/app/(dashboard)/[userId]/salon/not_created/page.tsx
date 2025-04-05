'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';

const NoSalonPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px -10px rgba(183, 110, 121, 0.3)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    },
    tap: { scale: 0.95 }
  };
   const router = useRouter();
   const pathname = usePathname();
   

   
     // Extract userId from pathname like /1234 or /5678/anything
  const userId = pathname.split('/')[1];
  return (
    <div className="min-h-screen flex flex-col">
      <motion.main 
        className="flex-1 relative bg-[#fff9f7] pt-24 pb-16 overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(#e8c4c0 0.5px, transparent 0.5px)",
          backgroundSize: "15px 15px"
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-[#b76e79] rounded-full opacity-10"
              style={{
                width: Math.random() * 50 + 20 + 'px',
                height: Math.random() * 50 + 20 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-playfair text-[#b76e79] mb-6"
              style={{ fontFamily: "'Dancing Script', cursive" }}
              variants={itemVariants}
            >
              Craft Your Digital Salon
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-12 leading-relaxed max-w-xl mx-auto"
              variants={itemVariants}
            >
              Transform your beauty business with a stunning online presence that wows clients and boosts bookings.
            </motion.p>

            <motion.div variants={itemVariants} className="mb-20">
              <motion.button
                className="bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white px-12 py-5 rounded-full text-lg font-medium flex items-center gap-3 mx-auto transform transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                animate="rest"
                onClick={()=>{router.push(`/${userId}/salon/creating`)}}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#d8a5a5] to-[#b76e79] opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <FaPlus className="text-xl relative z-10" />
                <span className="relative z-10">Create My Salon Now</span>
              </motion.button>
            </motion.div>

            

            {/* Animated Phone Mockup (Pure CSS) */}
          </motion.div>
        </div>

        {/* Floating Decorations */}
        <motion.div 
          className="absolute top-1/3 left-5 text-[#b76e79] text-2xl opacity-70"
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

        <motion.div 
          className="absolute bottom-20 right-10 text-[#e8c4c0] text-4xl"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✦
        </motion.div>
      </motion.main>
    </div>
  );
};

export default NoSalonPage;