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
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
          <svg 
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              className="fill-[#b76e79] opacity-20"
            />
          </svg>
        </div>

        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-[#e8c4c0] opacity-20 mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-[#b76e79] opacity-20 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            variants={containerVariants}
          >

            <motion.h1 
              className="text-5xl font-playfair text-[#b76e79] mb-6"
              style={{ fontFamily: "'Dancing Script', cursive" }}
              variants={itemVariants}
            >
              Your Salon Journey Begins Here
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-12 leading-relaxed max-w-xl mx-auto"
              variants={itemVariants}
            >
              It looks like you haven not set up your salon yet. Let us create a beautiful online presence that matches your brand is elegance.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.button
                className="bg-gradient-to-r from-[#b76e79] to-[#d8a5a5] text-white px-12 py-5 rounded-full text-lg font-medium flex items-center gap-3 mx-auto transform transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                animate="rest"
                onClick={()=>{router.push(`/${userId}/salon/creating`)}}
              >
                <FaPlus className="text-xl" />
                Create Your Salon Now
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
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
            rotate: [0, 5, -5, 0]
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