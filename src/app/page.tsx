"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jsonwebtoken";
import FinancialManagement from "@/Components/FinancialManagement";
import HomeHero from "@/Components/HomeHero";
import ProductsSection from "@/Components/ProductsSection";
import ResourceManagement from "@/Components/ResourceManagement";
import StaffManagement from "@/Components/StaffManagement";

// Define the shape of your token payload
interface DecodedToken {
  id?: string;
  [key: string]: unknown;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie;
      const authToken = cookies
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (authToken) {
        try {
          const decoded = jwtDecode.decode(authToken) as DecodedToken;

          if (decoded?.id) {
            router.push(`/${decoded.id}`);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, [router]);

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
