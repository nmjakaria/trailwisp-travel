"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

// Sample high-quality background images for a travel/adventure brand
const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop"
];

export default function InteractiveBanner(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  // Auto-scroll images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Motion values to track mouse coordinate positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out coordinate tracking using physics springs
  const springConfig = { damping: 30, stiffness: 100, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Subtle interactive parallax offset for the background imagery
  const bgX = useTransform(smoothMouseX, [-400, 400], [-15, 15]);
  const bgY = useTransform(smoothMouseY, [-400, 400], [-15, 15]);

  // Dynamic transforms for the brand accent glows overlaying the images
  const glow1X = useTransform(smoothMouseX, [-400, 400], [30, -30]);
  const glow1Y = useTransform(smoothMouseY, [-400, 400], [30, -30]);

  // Handle cursor positioning relative to layout container dimensions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  // Reset layer locations on cursor exit bounds
  const handleMouseLeave = (): void => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[100vh] min-h-[620px] flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* =========================================================================
          FULL-WIDTH BACKGROUND IMAGERY (Breaks out of layout boundaries)
          ========================================================================= */}
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.05 }}
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImgIndex}
            src={BANNER_IMAGES[currentImgIndex]}
            alt="Scenic Trail Journey Background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />
        </AnimatePresence>
      </motion.div>

      {/* Dark Ambient Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* Interactive Brand Color Glows */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30 dark:opacity-40">
        <motion.div
          style={{ x: glow1X, y: glow1Y }}
          className="absolute top-[10%] left-[15%] h-[450px] w-[450px] rounded-full bg-brand-teal/30 blur-[120px]"
        />
      </div>

      {/* Decorative Bottom Transition Mask Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />

      {/* =========================================================================
          MAX-W-7XL CONTENT FOREGROUND CONTAINER LAYER
          ========================================================================= */}
      <div className="container-app relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-6"
        >
          {/* Branded Pulse Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 dark:bg-black/40 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
            </span>
            Discover the Unexplored
          </div>

          {/* Branded Typography Header */}
          <h1 className="text-5xl font-black sm:text-6xl lg:text-7xl leading-[1.15] text-white drop-shadow-md">
            Whispering Trails, <br />
            <span className="bg-gradient-to-r from-brand-teal via-teal-300 to-brand-orange bg-clip-text text-transparent">
              Unforgettable Stories
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl font-medium text-neutral-200 drop-shadow-sm leading-relaxed">
            Join a modern community of passionate wanderers documenting authentic journeys. Map your global destinations, discover structural hidden corners, and secure your collection of lifelong memories.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/destinations">
              <Button
                size="lg"
                className="rounded-full bg-brand-orange font-bold text-white shadow-lg shadow-brand-orange/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 h-14 text-base"
              >
                Explore Destinations
              </Button>
            </Link>

            <Link href="/auth/signup">
              <Button
                variant="bordered"
                size="lg"
                className="rounded-full font-semibold border-white/40 text-white hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 h-14 text-base backdrop-blur-sm"
              >
                Share Your Story
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}