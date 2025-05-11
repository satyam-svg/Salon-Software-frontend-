export default function Screenloader() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      {/* Option 7: Liquid Wave */}
      <div className="w-24 h-24 relative">
        <svg viewBox="0 0 100 100" className="animate-wave">
          <path fill="#8B5CF6" d="M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z">
            <animate
              attributeName="d"
              dur="2s"
              repeatCount="indefinite"
              values="M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z;
                      M25,35 Q37.5,25 50,35 T75,35 L75,75 L25,75 Z;
                      M25,25 Q37.5,38 50,25 T75,25 L75,75 L25,75 Z"
            />
          </path>
        </svg>
      </div>

      <style jsx global>{`
        /* Scissors Animation */
        @keyframes snip-left {
          0%,
          100% {
            transform: rotate(15deg);
          }
          50% {
            transform: rotate(-5deg);
          }
        }
        @keyframes snip-right {
          0%,
          100% {
            transform: rotate(-15deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-snip-left {
          animation: snip-left 0.8s ease infinite;
        }
        .animate-snip-right {
          animation: snip-right 0.8s ease infinite;
        }

        /* Progress Bar Animation */
        @keyframes progress {
          0% {
            width: 0%;
            opacity: 0.8;
          }
          50% {
            width: 60%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0.8;
          }
        }
        .animate-progress {
          animation: progress 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Liquid Loader */
        @keyframes liquid {
          0%,
          100% {
            border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
          }
          34% {
            border-radius: 40% 60% 54% 46% / 49% 60% 40% 51%;
          }
          67% {
            border-radius: 54% 46% 38% 62% / 49% 70% 30% 51%;
          }
        }
        .liquid-loader {
          position: relative;
          width: 64px;
          height: 64px;
        }
        .blob {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          animation: liquid 3.4s linear infinite;
        }
        .blob:nth-child(2) {
          animation-delay: -1.7s;
          opacity: 0.7;
        }

        /* Morphing Blobs */
        @keyframes morph {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
        }
        .animate-morph {
          animation: morph 1.2s ease-in-out infinite;
        }

        /* Liquid Wave */
        @keyframes wave {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
