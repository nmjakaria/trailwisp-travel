"use client";

import React from "react";
import { Users, MapPinned, Compass, Star } from "lucide-react";

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
  highlightColor: "teal" | "orange";
}

const STATS: StatItem[] = [
  {
    icon: MapPinned,
    value: "350+",
    label: "Verified Escapes",
    description: "Properties checked for premium comfort.",
    highlightColor: "teal",
  },
  {
    icon: Users,
    value: "18k+",
    label: "Happy Explorers",
    description: "Memorable journeys completed securely.",
    highlightColor: "orange",
  },
  {
    icon: Compass,
    value: "45+",
    label: "Local Regions",
    description: "Diverse track categories from coast to peak.",
    highlightColor: "teal",
  },
  {
    icon: Star,
    value: "4.92",
    label: "Top Tier Rating",
    description: "Average score across global guest feedback.",
    highlightColor: "orange",
  },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-transparent">
      <div className="container-app">
        {/* Using your custom global .section-muted theme background block */}
        <div className="section-muted p-8 sm:p-10 lg:p-12 border border-border/50 shadow-sm relative overflow-hidden">
          
          {/* Subtle graphic flare inside the layout background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-teal/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none" />

          {/* Core Grid Matrix Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
            {STATS.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="flex flex-col items-center text-center px-4 space-y-2 lg:border-r last:border-r-0 border-border/60"
                >
                  {/* Decorative Icon Wrapper */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                    stat.highlightColor === "teal" 
                      ? "bg-brand-teal/10 border-brand-teal/20 text-brand-teal" 
                      : "bg-brand-orange/10 border-brand-orange/20 text-brand-orange"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Large Scale Display Counter Metric */}
                  <div className="space-y-0.5">
                    <span className="text-3xl md:text-4xl font-black tracking-tight text-foreground font-sans block">
                      {stat.value}
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-brand-slate dark:text-zinc-300 font-display">
                      {stat.label}
                    </h4>
                  </div>

                  {/* Micro Helper Context Text */}
                  <p className="text-[11px] text-muted-foreground font-sans max-w-[180px] leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}