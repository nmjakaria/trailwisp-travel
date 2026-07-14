import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { FooterSection } from "@/components/FooterSection";
import { Toast } from "@heroui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trailwisp - Adventure Awaits",
  description: "Trailwisp is a travel and adventure brand that inspires wanderlust and exploration through curated experiences, gear, and storytelling. Discover your next adventure with us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Toast.Provider placement="top end"
            width={380}
            gap={12}
            maxVisibleToasts={4}
            className="top-6 right-6" />
          <Navbar />
          {children}
          <FooterSection />
        </Providers>
      </body>
    </html>
  );
}
