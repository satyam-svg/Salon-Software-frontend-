"use client";
import { motion } from "framer-motion";

export default function ScreenLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 relative">
      {/* Main Liquid Loader - Reduced Size */}
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="animate-liquid-wave">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b76e79" />
              <stop offset="100%" stopColor="#e8c4c0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient)"
            d="M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z"
          >
            <animate
              attributeName="d"
              dur="3.5s"
              repeatCount="indefinite"
              values="
                M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z;
                M20,30 Q40,15 50,30 T80,30 L80,80 L20,80 Z;
                M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z;
                M30,20 Q45,40 50,20 T70,20 L70,70 L30,70 Z;
                M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z"
            />
          </path>
        </svg>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Branding Text */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3
          className="text-3xl font-dancing-script text-[#b76e79] animate-pulse"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          SalonSphere
        </h3>
        <p className="text-[#e8c4c0] font-light text-lg">
          Crafting Elegance...
        </p>
      </motion.div>

      <style jsx global>{`
        @keyframes liquid-wave {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(3deg);
          }
          50% {
            transform: translateY(10px) rotate(-2deg);
          }
          75% {
            transform: translateY(-5px) rotate(1deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes shimmer {
          0% {
            left: -50%;
          }
          100% {
            left: 150%;
          }
        }

        .animate-liquid-wave {
          animation: liquid-wave 4.5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
