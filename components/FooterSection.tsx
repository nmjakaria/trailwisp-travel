"use client";

import React from "react";
import { Link } from "@heroui/react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: "Features", href: "#" },
      { label: "Live Maps", href: "#" },
      { label: "Pricing plans", href: "#" },
    ],
    community: [
      { label: "Explore Stories", href: "#" },
      { label: "Creator Spotlights", href: "#" },
      { label: "Travel Forums", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie settings", href: "#" },
    ],
  };

  return (
    <footer className="bg-background-tertiary border-zinc-200/60 dark:border-zinc-800 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Brand Identity Pillar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-teal-600 shadow shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Trail<span className="bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent">wisp</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed">
              A comprehensive documentation canvas tailored for modern full-stack travelers mapping authentic, unvarnished pathways.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Product</span>
            {links.product.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal transition-colors w-fit">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Community Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Community</span>
            {links.community.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal transition-colors w-fit">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Legal</span>
            {links.legal.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-teal dark:hover:text-brand-teal transition-colors w-fit">
                {item.label}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom copyright alignment divider */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {currentYear} Trailwisp Inc. Built in Chittagong, Bangladesh. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Designed for performance and structural accuracy.
          </p>
        </div>

      </div>
    </footer>
  );
}