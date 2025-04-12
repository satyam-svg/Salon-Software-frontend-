"use client";
import { motion, useInView } from "framer-motion";
import {
  FiStar,
  FiClock,
  FiScissors,
  FiSmile,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import { format } from "date-fns";
import { useRef } from "react";

interface FeedbackItem {
  id: number;
  name: string;
  feedback: string;
  timestamp: Date;
  service: string;
  rating: number;
  avatar: string;
}

const FeedbackPage = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const dummyFeedback: FeedbackItem[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      feedback:
        "Absolutely loved my new haircut! The stylist was incredibly professional and really listened to what I wanted.",
      timestamp: new Date(2024, 2, 15, 14, 30),
      service: "Haircut",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      feedback:
        "The coloring service was good, though it took a bit longer than expected. End result was worth it!",
      timestamp: new Date(2024, 2, 14, 11, 15),
      service: "Hair Coloring",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Emma Williams",
      feedback:
        "Best facial treatment I've ever had. My skin feels rejuvenated and the ambiance was so relaxing.",
      timestamp: new Date(2024, 2, 13, 16, 45),
      service: "Facial Treatment",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    // Add more dummy data as needed
  ];

  const ServiceIcon = ({ service }: { service: string }) => {
    const icons = {
      Haircut: <FiScissors className="text-purple-600" />,
      "Hair Coloring": <FiSmile className="text-pink-500" />,
      "Facial Treatment": <FiUser className="text-blue-500" />,
    };

    return (
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        className="p-3 bg-white rounded-full shadow-md"
      >
        {icons[service as keyof typeof icons] || <FiStar />}
      </motion.div>
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.15, duration: 0.5, type: "spring" },
    }),
    hover: { y: -10 },
  };

  const starVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen  py-20 px-4 sm:px-6 lg:px-8"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 relative inline-block">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-8 -left-8"
            >
              ✨
            </motion.span>
            Client Experiences
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-8 -right-8"
            >
              ✨
            </motion.span>
          </h1>
          <p className="text-xl text-gray-600">
            Discover what our clients say about our services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyFeedback.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              custom={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

              <div className="h-full bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 group-hover:shadow-2xl relative">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                      >
                        <img
                          src={feedback.avatar}
                          alt={feedback.name}
                          className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <FiStar className="text-white text-xs" />
                        </div>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {feedback.name}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              variants={starVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: i * 0.1 }}
                            >
                              <FiStar
                                className={`w-5 h-5 ${
                                  i < feedback.rating
                                    ? "text-amber-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ServiceIcon service={feedback.service} />
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 mb-6 italic relative before:content-['“'] before:text-4xl before:absolute before:-left-2 before:-top-4 before:text-gray-200 after:content-['”'] after:text-4xl after:absolute after:-right-2 after:-bottom-4 after:text-gray-200"
                  >
                    {feedback.feedback}
                  </motion.p>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FiClock className="text-purple-500" />
                      <span>{format(feedback.timestamp, "MMM d, yyyy")}</span>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-purple-600 font-medium cursor-pointer"
                    >
                      <span>Read More</span>
                      <FiChevronRight className="ml-1" />
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">Explore More Reviews</span>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-20 left-20 w-48 h-48 bg-purple-100 rounded-full opacity-30 mix-blend-multiply blur-xl -z-10"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 mix-blend-multiply blur-xl -z-10"
      />
    </motion.div>
  );
};

export default FeedbackPage;
