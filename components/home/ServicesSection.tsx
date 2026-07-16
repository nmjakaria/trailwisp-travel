"use client";

import React from "react";
import { ShieldCheck, Compass, Headphones, Wallet } from "lucide-react";

interface ServiceItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: ShieldCheck,
    title: "Secure Bookings",
    description: "Your trust is our priority. Every transaction is encrypted, and every host is strictly verified.",
  },
  {
    icon: Compass,
    title: "Local Curated Guides",
    description: "Explore destinations like a native with customized itineraries built by regional travel experts.",
  },
  {
    icon: Headphones,
    title: "24/7 Concierge Support",
    description: "Stuck in a different time zone? Our dedicated live support team is always just a tap away.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden service fees, no surprise processing taxes. What you see is exactly what you pay.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-transparent">
      <div className="container-app space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-brand-teal">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground font-display">
            Elevating Your Travel Standard
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            We handle the minor logistics so you can focus entirely on immersing yourself in the destination.
          </p>
        </div>

        {/* Services Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="trailwisp-card p-6 space-y-4 hover:border-brand-teal/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center border border-brand-teal/20 shrink-0">
                  <IconComponent className="w-6 h-6 text-brand-teal" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground font-display">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}