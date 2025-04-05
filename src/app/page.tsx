"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decode } from "jsonwebtoken"; // ✅ Named import
import FinancialManagement from "@/Components/FinancialManagement";
import HomeHero from "@/Components/HomeHero";
import ProductsSection from "@/Components/ProductsSection";
import ResourceManagement from "@/Components/ResourceManagement";
import StaffManagement from "@/Components/StaffManagement";
import LoadingScreen from "@/Components/LoadingSpinner";

// Define the shape of your token payload
interface DecodedToken {
  id?: string;
  [key: string]: unknown;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // default to true

  useEffect(() => {
    // Simulate 3s loading delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    if (typeof document !== "undefined") {
      const cookies = document.cookie;
      const authToken = cookies
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (authToken) {
        try {
          const decoded = decode(authToken) as DecodedToken;

          if (decoded?.id) {
            router.push(`/${decoded.id}`);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <HomeHero />
      <ProductsSection />
      <StaffManagement />
      <ResourceManagement />
      <FinancialManagement />
    </>
  );
}
