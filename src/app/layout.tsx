import type { Metadata } from "next";
import {  Zilla_Slab } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { SignupProvider } from "@/context/SignupContext";
import { LoginProvider } from "@/context/LoginContext";
import { ForgetPasswordProvider } from "@/context/ForgetpassContext";



const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Ensure proper weight selection
  display: "swap",
});

export const metadata: Metadata = {
  title: "SalonSphere - Complete Salon Management Platform",
  description: "SalonSphere empowers salon owners with a comprehensive ecosystem to manage appointments, staff, clients, and operations. All-in-one solution for modern salon management with real-time analytics and booking system.",
  keywords: [
    "salon management",
    "beauty business software",
    "appointment scheduling",
    "salon ecosystem",
    "beauty salon platform",
    "salon owner tools",
    "client management system",
    "salon administration"
  ],
  openGraph: {
    title: "SalonSphere - Your Complete Salon Management Solution",
    description: "Transform your salon business with our all-in-one management platform. Streamline operations, enhance client experience, and grow your beauty business.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "SalonSphere Platform Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SalonSphere - Digital Ecosystem for Beauty Professionals",
    description: "Take control of your salon business with integrated management tools, client retention systems, and smart analytics.",
    images: ["/twitter-salonsphere.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LoginProvider>
      <SignupProvider>
      <ForgetPasswordProvider>
      {/* Apply Zilla Slab globally */}
      <body className={`${zillaSlab.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
      </ForgetPasswordProvider>
      </SignupProvider>
      </LoginProvider>
    </html>
  );
}
