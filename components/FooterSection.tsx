"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const links = {
    explore: [
      { label: "Public Stories", href: "/stories" },
      { label: "About Trailwisp", href: "/about" },
      { label: "Latest Bulletins", href: "/news" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help & Support", href: "/support" },
      { label: "User Dashboard", href: "/dashboard/user" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-background-tertiary border-t border-zinc-200/60 dark:border-zinc-800 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Brand Identity Pillar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <Image
                alt="Trailwisp Logo"
                src="/trailwisp-logo.png"
                // src="https://fastly.4sqi.net/img/general/600x600/170077684_WurW-saVWWTofqkCCrMb8YKNOocyqgaB34fc9AQrI4Q.png"
                width={35}
                height={35}
                className="object-contain"
              />
            </div>
            <div className="hidden leading-none sm:block">
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
              </span>
            </div>
          </Link>
        </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed">
              A modern travel chronicle platform built for authentic travelers to map, share, and archive their unvarnished journeys worldwide.
            </p>
          </div>

          {/* Explore Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Explore</span>
            {links.explore.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-fit">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Support</span>
            {links.support.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-fit">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Legal</span>
            {links.legal.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-fit">
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