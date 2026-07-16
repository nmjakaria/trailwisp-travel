"use client";

import React from "react";
import { Palmtree, Trees, Building2, Flame, Tent } from "lucide-react";

interface CategoryItem {
  slug: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  imageUrl: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    slug: "beach",
    name: "Coastal Beaches",
    count: 142,
    icon: Palmtree,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    slug: "nature",
    name: "Wilderness & Woods",
    count: 96,
    icon: Trees,
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
  },
  {
    slug: "city",
    name: "Urban Centers",
    count: 84,
    icon: Building2,
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80",
  },
  {
    slug: "adventure",
    name: "Camping & Peaks",
    count: 65,
    icon: Tent,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-transparent">
      <div className="container-app space-y-10">
        
        {/* Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-brand-orange">
              Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground font-display">
              Browse by Vibe
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs font-sans">
            Find the perfect environment tailored directly to your current mental escape requirements.
          </p>
        </div>

        {/* Categories Grid Array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.slug}
                className="group relative h-64 rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer"
              >
                {/* Visual Image Background Wrapper */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover select-none pointer-events-none transform scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Dark Layer Overlay matching your hero styles */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-slate/90 via-brand-slate/40 to-transparent" />
                </div>

                {/* Content Elements */}
                <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between items-start text-white">
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  <div className="space-y-1 w-full">
                    <h3 className="text-lg font-bold tracking-tight font-display text-white">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-medium text-zinc-200/90 font-sans">
                      <span>{cat.count} Spaces Available</span>
                      <span className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}