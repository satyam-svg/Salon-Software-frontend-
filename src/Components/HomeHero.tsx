"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLogin } from "@/context/LoginContext";
import { AnimatedButton } from "./ui/Button";

const HomeHero = () => {
  const [mounted, setMounted] = useState(false);
  const [perspective, setPerspective] = useState(420);
  const [mobileview, setMobileview] = useState(false);
  const { setLoginToggle } = useLogin();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);
  const galleryRotateY = useMotionValue(0);
  const isHovered = false;

  const galleryImages = [
    "/salon.png",
    "/Client.png",
    "/Staff.png",
    "/dashboard.png",
    "/appointment.png",
    "/Feedback.png",
    "/Finance.png",
    "/branch.png",
  ];

  const imageLabels = [
    "Salon",
    "Clients",
    "Team",
    "Dashboard",
    "Bookings",
    "Reviews",
    "Finance",
    "Branches",
  ];
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";

  useEffect(() => {
    setMounted(true);

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updatePerspective = () => {
      const screenWidth = window.innerWidth;
      setPerspective(screenWidth <= 1280 ? 600 : 420);
      setMobileview(screenWidth <= 1000);
    };

    updatePerspective();
    window.addEventListener("resize", updatePerspective);
    return () => window.removeEventListener("resize", updatePerspective);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const rotationSpeed = 0.3;

    const animateRotation = () => {
      if (!isHovered) {
        galleryRotateY.set(galleryRotateY.get() + rotationSpeed);
      }
      animationFrameId = requestAnimationFrame(animateRotation);
    };

    animationFrameId = requestAnimationFrame(animateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  if (!mounted) return null;

  return (
    <section
      className="relative h-[100dvh] max-h-[900px] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* ANIMATED SCISSORS BACKGROUND */}
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{
          translateY: [0, -15, 0, 15, 0],
          rotate: [0, -3, 0, 3, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          filter: "drop-shadow(0 0 40px rgba(183, 110, 121, 0.5))",
        }}
      >
        <Image
          src="/scissors.png"
          alt="Salon scissors"
          width={900}
          height={900}
          className="w-[75vw] md:w-[55vw] max-w-[900px] h-auto opacity-30"
          priority
        />
      </motion.div>

      {/* DYNAMIC GRADIENT BACKGROUND */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at center, var(--rose-gold) 0%, transparent 70%)`,
        }}
      />

      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
        <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-4 lg:gap-8 xl:gap-12">
          {/* TEXT CONTENT */}
          <motion.div
            className="relative w-full lg:w-1/2 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-[8vw] sm:text-[6vw] md:text-[5vw] lg:text-[4vw] font-bold mb-2 lg:mb-4 leading-[1.1] text-center lg:text-left ">
              {["Create", "Your Own", "Salon Ecosystem"].map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 + 1 }}
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${lightRoseGold}, ${roseGold})`,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.2vw] text-foreground mb-4 lg:mb-8 max-w-full lg:max-w-[90%] text-center lg:text-left px-4 lg:px-0"
            >
              Transform your beauty business with our all-in-one platform
              integrating
              <span className="text-rose-gold-light">
                {" "}
                management, bookings, and community
              </span>
              . Elevate your salon to celestial heights.
            </motion.p>

            <AnimatedButton
              onClick={() => setLoginToggle(true)}
              variant="solid"
              size="lg"
              hoverEffect="scale"
              gradient={[roseGold, lightRoseGold]}
              className="px-[4vw] py-[1.5vw] lg:px-[2vw] lg:py-[1vw] text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.2vw] lg:mx-0"
            >
              Launch Your Ecosystem
            </AnimatedButton>
          </motion.div>

          {/* DESKTOP GALLERY */}
          <div className="hidden lg:block relative w-full lg:w-1/2 h-[50vh]">
            <motion.div
              className="w-full h-full"
              style={{
                perspective: `${perspective}px`,
                rotateX,
                rotateY,
              }}
            >
              <motion.div
                className="gallery-container"
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className="gallery-item"
                    style={
                      {
                        "--i": i + 1,
                        transform: `rotateY(calc(var(--i) * 45deg)) translateZ(calc(min(20vw, 200px)))`,
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      src={img}
                      alt={`Gallery image ${i + 1}`}
                      className="gallery-image"
                      width={200}
                      height={300}
                      loading={i < 3 ? "eager" : "lazy"}
                      priority={i < 2}
                      quality={85}
                    />
                    <div className="gallery-overlay" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* MOBILE GALLERY */}
          {mobileview && (
            <div
              className="lg:hidden w-full h-[45vh] overflow-hidden relative mt-8"
              style={{ backgroundColor: "var(--background)" }}
            >
              <motion.div
                className="h-full grid grid-cols-2 gap-4 px-4 overflow-y-auto pb-8 snap-y"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className="relative h-48 snap-center group"
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 80,
                        damping: 15,
                        delay: i * 0.1,
                      },
                    }}
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3 + 0.5,
                      },
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg shadow-rose-900/10">
                      <Image
                        src={img}
                        alt={imageLabels[i]}
                        fill
                        className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 100vw"
                        loading="eager"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/10" />
                      <div
                        className="absolute bottom-3 left-3 text-background text-sm font-bold backdrop-blur-sm px-3 py-1 rounded-full"
                        style={{ backgroundColor: "var(--rose-gold)" }}
                      >
                        {imageLabels[i]}
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 border rounded-3xl pointer-events-none"
                      style={{ borderColor: "var(--rose-gold-light)" }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* SCROLL INDICATOR */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full backdrop-blur-sm"
                    style={{ backgroundColor: "var(--rose-gold)" }}
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .gallery-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .gallery-item {
          position: absolute;
          width: calc(min(15vw, 150px));
          height: calc(min(22vw, 220px));
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.2) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.05);
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .snap-y {
          scroll-snap-type: y mandatory;
        }

        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};

export default HomeHero;
