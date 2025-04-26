"use client";

import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import LoginPopup from "./Login";
import { useLogin } from "@/context/LoginContext";
import { useSignup } from "@/context/SignupContext";
import Signup from "./Signup";
import { useForgetPassword } from "@/context/ForgetpassContext";
import ForgotPassword from "./Forgotpasswrd";

interface NavLink {
  name: string;
  path: string;
  icon: string;
}

interface DecodedToken {
  id: string;
  userId: string;
}

const StellarNavbar: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userid = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState({ fullname: "", profile_img: "" });
  const [hasSalon, setHasSalon] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { signupToggle } = useSignup();
  const roseGold = "#b76e79";
  const lightRoseGold = "#d4a373";
  const dimRoseGold = "#f8e9eb";
  const { loginToggle, setLoginToggle } = useLogin();
  const { forgetPasswordToggle } = useForgetPassword();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authToken = Cookies.get("authToken");
      const staffToken = Cookies.get("staffToken");
      if (authToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(authToken);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${decoded.id}`
          );
          console.log(decoded.id);
          const { fullname, profile_img } = response.data.user;
          setUserData({ fullname, profile_img });
        } catch (error) {
          console.log(error);
        }
      }
      if (staffToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(staffToken);
          console.log("decode is", decoded);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/staff/get/${decoded.userId}`
          );
          console.log("response is", response);

          const { fullname, profile_img } = response.data;
          setUserData({ fullname, profile_img });
        } catch (error) {
          console.log(error);
        }
      }
    };

    checkAuthStatus();
  }, [pathname]);

  useEffect(() => {
    const checkSalonStatus = async () => {
      const authToken = Cookies.get("authToken");
      if (!authToken) return;

      try {
        const decoded = jwtDecode<DecodedToken>(authToken);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${decoded.id}`
        );
        const data = response.data;
        const userId = decoded.id;
        console.log(data.user.step);
        if (data.user.step == 0) {
          router.push(`/${userId}/salon/not_created`);
        } else if (data.user.step == 6) {
          // router.push(`/${userId}/ownerhomepage`)
          setHasSalon(true);
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(timer);
                // router.push(`/${userId}/ownerhomepage`);
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          router.push(`/${userId}/salon/creating`);
        }
      } catch (error) {
        console.error("Error checking salon status:", error);
        // router.push('/error');
      }
    };

    checkSalonStatus();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("staffToken");
    setUserData({ fullname: "", profile_img: "" });
    setIsProfileOpen(false);
    router.push("/");
  };

  const navLinks: NavLink[] = [
    {
      name: "Home",
      path: "/",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Products",
      path: "/products",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    { name: "Staff", path: "/services", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    {
      name: "Resource",
      path: "/about",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      name: "Finance",
      path: "/contact",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const menuVariants = {
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const linkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const topLine = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 7 },
  };

  const middleLine = {
    closed: { opacity: 1, y: 5 },
    open: { opacity: 0, y: 2 },
  };

  const bottomLine = {
    closed: { rotate: 0, y: 10 },
    open: { rotate: -45, y: -8 },
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");
      `}</style>

      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-14">
            <Link href="/" passHref>
              <motion.div
                className="flex items-center space-x-3 group relative"
                onHoverStart={() => !isMobile && setIsHovered(true)}
                onHoverEnd={() => !isMobile && setIsHovered(false)}
                whileHover={!isMobile ? "hover" : undefined}
              >
                <motion.div
                  className="h-9 w-9 lg:h-10 lg:w-10 transition-all duration-300 relative"
                  whileHover={{ scale: isMobile ? 1 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </motion.div>
                <div className="flex flex-col relative">
                  <motion.span
                    className="text-2xl font-bold tracking-tight"
                    style={{
                      color: roseGold,
                      fontFamily: "'Dancing Script', cursive",
                    }}
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    SalonSphere
                  </motion.span>

                  <AnimatePresence>
                    {!isMobile && isHovered && (
                      <motion.span
                        className="absolute top-full left-0 text-1xl font-light tracking-wide whitespace-nowrap"
                        style={{
                          color: lightRoseGold,
                          fontFamily: "'Dancing Script', cursive",
                        }}
                        variants={{
                          hidden: { opacity: 0, y: -5 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              delay: 0.1,
                            },
                          },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        A complete salon ecosystem
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={linkVariants}>
                  <Link href={link.path} passHref>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <p
                        className={`transition-colors duration-300 ${
                          pathname === link.path
                            ? "text-[#b76e79]"
                            : "text-gray-500 hover:text-[#b76e79]"
                        }`}
                        style={{ fontFamily: "IBM Plex Mono" }}
                      >
                        {link.name}
                        <motion.span
                          className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                            pathname === link.path
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                          style={{ backgroundColor: roseGold }}
                        />
                      </p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              {userData.fullname ? (
                <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 group"
                  >
                    <div
                      className="relative h-9 w-9 rounded-full overflow-hidden border-2"
                      style={{ borderColor: roseGold }}
                    >
                      <Image
                        src={userData.profile_img || "/default-profile.png"}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <span
                      className="text-gray-700 font-medium"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {userData.fullname}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
                        style={{ border: `1px solid ${dimRoseGold}` }}
                      >
                        <Link href={`/${userid}/ownerhomepage`} passHref>
                          <motion.div
                            className="px-4 py-3 hover:bg-rose-50 cursor-pointer"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-gray-700">Homepage</span>
                          </motion.div>
                        </Link>
                        <Link href={`/${userid}/dashboard`} passHref>
                          <motion.div
                            className="px-4 py-3 hover:bg-rose-50 cursor-pointer"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-gray-700">Dashboard</span>
                          </motion.div>
                        </Link>
                        <motion.div
                          className="px-4 py-3 hover:bg-rose-50 cursor-pointer"
                          onClick={handleLogout}
                          whileHover={{ x: 5 }}
                        >
                          <span className="text-rose-700">Logout</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLoginToggle(!loginToggle)}
                  className="px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(to right, ${roseGold}, ${lightRoseGold})`,
                    color: "white",
                  }}
                >
                  Get Started
                </motion.button>
              )}
            </div>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg focus:outline-none"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <div className="w-7 h-7 relative flex items-center justify-center">
                <motion.span
                  className="absolute block w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: roseGold }}
                  variants={topLine}
                  animate={isMenuOpen ? "open" : "closed"}
                />
                <motion.span
                  className="absolute block w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: roseGold }}
                  variants={middleLine}
                  animate={isMenuOpen ? "open" : "closed"}
                />
                <motion.span
                  className="absolute block w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: roseGold }}
                  variants={bottomLine}
                  animate={isMenuOpen ? "open" : "closed"}
                />
              </div>
            </motion.button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                  onClick={() => setIsMenuOpen(false)}
                />

                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuVariants}
                  className="lg:hidden fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4"
                >
                  <div
                    className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
                    style={{ boxShadow: `0 25px 50px -12px ${roseGold}20` }}
                  >
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-full hover:bg-rose-50 transition-colors"
                        style={{ color: roseGold }}
                      >
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col p-6 pt-12">
                      <motion.div
                        className="mb-6 text-center"
                        variants={linkVariants}
                      >
                        <div
                          className="inline-block p-4 rounded-2xl mb-3"
                          style={{ backgroundColor: dimRoseGold }}
                        >
                          <div className="w-12 h-12 relative">
                            <Image
                              src="/logo.png"
                              alt="Logo"
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                        </div>
                        <h3
                          className="text-2xl font-bold"
                          style={{
                            color: roseGold,
                            fontFamily: "'Dancing Script', cursive",
                          }}
                        >
                          SalonSphere
                        </h3>
                      </motion.div>

                      <div className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                          <motion.div
                            key={link.name}
                            variants={linkVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                          >
                            <Link href={link.path} passHref>
                              <motion.div
                                className="group flex items-center px-5 py-3 rounded-xl hover:bg-rose-50 transition-all"
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <svg
                                  className="flex-shrink-0 w-6 h-6 mr-3"
                                  fill="none"
                                  stroke={roseGold}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={link.icon}
                                  />
                                </svg>
                                <p className="text-base font-medium text-gray-700 group-hover:text-rose-700">
                                  {link.name}
                                </p>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-6"
                      >
                        {userData.fullname ? (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3">
                              <div
                                className="relative h-10 w-10 rounded-full overflow-hidden border-2"
                                style={{ borderColor: roseGold }}
                              >
                                <Image
                                  src={
                                    userData.profile_img ||
                                    "/default-profile.png"
                                  }
                                  alt="Profile"
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <span className="text-gray-700 font-medium">
                                {userData.fullname}
                              </span>
                            </div>
                            {hasSalon && (
                              <div className="text-center text-sm text-rose-700">
                                Redirecting to dashboard in {countdown}...
                              </div>
                            )}
                            <Link href="/profile" passHref>
                              <motion.div
                                className="w-full px-5 py-3 rounded-xl text-base font-semibold transition-all"
                                style={{
                                  backgroundColor: dimRoseGold,
                                  color: roseGold,
                                }}
                              >
                                Profile
                              </motion.div>
                            </Link>
                            <motion.button
                              onClick={handleLogout}
                              className="w-full px-5 py-3 rounded-xl text-base font-semibold transition-all"
                              style={{
                                background: `linear-gradient(to right, ${roseGold}, ${lightRoseGold})`,
                                color: "white",
                              }}
                            >
                              Logout
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setLoginToggle(!loginToggle);
                            }}
                            className="w-full px-5 py-3 rounded-xl text-base font-semibold transition-all"
                            style={{
                              background: `linear-gradient(to right, ${roseGold}, ${lightRoseGold})`,
                              color: "white",
                              boxShadow: `0 4px 24px ${roseGold}30`,
                            }}
                          >
                            Get Started
                          </motion.button>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {loginToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <LoginPopup />
            </motion.div>
          </motion.div>
        )}
        {signupToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Signup />
            </motion.div>
          </motion.div>
        )}
        {forgetPasswordToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <ForgotPassword />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StellarNavbar;
