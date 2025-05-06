"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { decode } from "jsonwebtoken";
import { motion } from "framer-motion";
import { useLogin } from "@/context/LoginContext";
import { useSignup } from "@/context/SignupContext";
import FinancialManagement from "@/Components/FinancialManagement";
import HomeHero from "@/Components/HomeHero";
import ProductsSection from "@/Components/ProductsSection";
import ResourceManagement from "@/Components/ResourceManagement";
import StaffManagement from "@/Components/StaffManagement";
import LoadingScreen from "@/Components/LoadingSpinner";
import LoginPopup from "../Components/Login";
import Signup from "../Components/Signup";

interface DecodedToken {
  id?: string;
  [key: string]: unknown;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [isSpecialDomain, setIsSpecialDomain] = useState(false);
  const { loginToggle, setLoginToggle } = useLogin();
  const { signupToggle } = useSignup();

  // Scroll handling effect
  useEffect(() => {
    if (!loading) {
      const handleScroll = () => {
        const currentSection = sectionsRef.current.find((section) => {
          const rect = section.getBoundingClientRect();
          return (
            rect.top <= window.innerHeight * 0.3 &&
            rect.bottom >= window.innerHeight * 0.3
          );
        });

        if (
          currentSection &&
          currentSection.id !== window.location.hash.slice(1)
        ) {
          window.history.replaceState(null, "", `#${currentSection.id}`);
        }
      };

      sectionsRef.current = [
        "home",
        "products",
        "staff",
        "resources",
        "finance",
      ]
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (!window.location.hash && sectionsRef.current[0]) {
        window.history.replaceState(null, "", `#${sectionsRef.current[0].id}`);
      }

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loading]);

  // Domain check effect
  useEffect(() => {
    const currentDomain = window.location.hostname;
    const isLocal =
      currentDomain === "evankiunisexsalon.in" ||
      currentDomain === "evankiunisexsalon.in";
    setIsSpecialDomain(isLocal);
    if (!isLocal) setLoginToggle(false);
  }, [setLoginToggle]);

  // Authentication check effect
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);

    const checkAuth = () => {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (authToken) {
        try {
          const decoded = decode(authToken) as DecodedToken;
          if (decoded?.id) router.push(`/${decoded.id}`);
        } catch (error) {
          console.error("Error decoding token:", error);
          if (isSpecialDomain) setLoginToggle(true);
        }
      } else {
        if (isSpecialDomain) setLoginToggle(true);
      }
    };

    checkAuth();
    return () => clearTimeout(timeout);
  }, [router, setLoginToggle, isSpecialDomain]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      {!isSpecialDomain ? (
        // Regular domain content
        <>
          <section id="home" data-section="home">
            <HomeHero />
          </section>
          <section id="products" data-section="products">
            <ProductsSection />
          </section>
          <section id="staff" data-section="staff">
            <StaffManagement />
          </section>
          <section id="resources" data-section="resources">
            <ResourceManagement />
          </section>
          <section id="finance" data-section="finance">
            <FinancialManagement />
          </section>
        </>
      ) : (
        // Localhost content
        <>
          <h1>hi</h1>
          {loginToggle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
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
        </>
      )}

      {/* Global Signup Modal */}
      {signupToggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
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
    </>
  );
}
