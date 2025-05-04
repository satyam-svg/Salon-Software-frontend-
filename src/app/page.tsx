"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { decode } from "jsonwebtoken";
import FinancialManagement from "@/Components/FinancialManagement";
import HomeHero from "@/Components/HomeHero";
import ProductsSection from "@/Components/ProductsSection";
import ResourceManagement from "@/Components/ResourceManagement";
import StaffManagement from "@/Components/StaffManagement";
import LoadingScreen from "@/Components/LoadingSpinner";

interface DecodedToken {
  id?: string;
  [key: string]: unknown;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const sectionsRef = useRef<HTMLElement[]>([]);

  // Add this useEffect for scroll-based hash updates
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

      // Initialize sections after load
      sectionsRef.current = [
        "home",
        "products",
        "staff",
        "resources",
        "finance",
      ]
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      // Set initial hash if empty
      if (!window.location.hash && sectionsRef.current[0]) {
        window.history.replaceState(null, "", `#${sectionsRef.current[0].id}`);
      }

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loading]);

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
        }
      }
    };

    checkAuth();
    return () => clearTimeout(timeout);
  }, [router]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      {/* Add data-section attributes for better detection */}
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
  );
}
