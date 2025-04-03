import type { Metadata } from "next";
import {  Zilla_Slab } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { SignupProvider } from "@/context/SignupContext";
import { LoginProvider } from "@/context/LoginContext";



const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Ensure proper weight selection
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
      {/* Apply Zilla Slab globally */}
      <body className={`${zillaSlab.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
      </SignupProvider>
      </LoginProvider>
    </html>
  );
}
