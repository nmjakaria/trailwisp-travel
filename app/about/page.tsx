"use client";

import React from "react";
import { Card, Chip } from "@heroui/react";
import { Compass, Heart, StarFill } from "@gravity-ui/icons";

export default function AboutPage() {
  const stats = [
    { label: "Active Explorers", value: "10K+", color: "from-teal-400 to-teal-600", icon: <Compass size={24} /> },
    { label: "Stories Shared", value: "45K", color: "from-orange-400 to-rose-500", icon: <Heart size={24} /> },
    { label: "Countries Mapped", value: "195", color: "from-blue-400 to-indigo-600", icon: <StarFill size={24} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16 overflow-hidden">
      {/* Colorful Hero */}
      <div className="text-center space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full -z-10" />
        <Chip variant="flat" className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-none font-bold">
          Our Journey
        </Chip>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Mapping the <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-orange-500 bg-clip-text text-transparent">Uncharted</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Trailwisp was born in Chittagong, Bangladesh, to bridge the gap between open-source community documentation and structural geospatial journaling.
        </p>
      </div>

      {/* Interactive Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className="p-8 border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${stat.color} transition-opacity duration-300`} />
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">{stat.value}</h3>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-2 uppercase tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}