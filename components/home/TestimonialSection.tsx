"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  comment: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Tahmid Rahman",
    role: "Adventure Enthusiast",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    rating: 5,
    comment: "Booking our Cox's Bazar tour was seamless. The transparent pricing matched exactly what was charged to our card, and the package duration details were pinpoint accurate.",
  },
  {
    name: "Sarah Jenkins",
    role: "Remote Software Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    comment: "The wilderness cabin curated here provided immaculate high-speed setups along with pristine architecture views. Absolute five-star customer concierge service experience.",
    rating: 5,
  },
  {
    name: "Arif Faisal",
    role: "Corporate Travel Lead",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    comment: "Highly recommended application layout structure. The filters are exceptionally fast, data loads immediately, and the host communication pipelines are thoroughly structured.",
    rating: 4.8,
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="container-app space-y-12 relative z-10">
        
        {/* Title Elements Layout */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-brand-teal">
            Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground font-display">
            Trusted by Travelers Worldwide
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Hear first-hand evaluations from members who recently returned from our premium escape listings.
          </p>
        </div>

        {/* Translucent Glass Grids Setup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review, idx) => (
            <div 
              key={idx}
              className="glass-card p-6 flex flex-col justify-between gap-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-teal/10 pointer-events-none select-none" />
              
              <div className="space-y-3">
                {/* Dynamic Star Iteration */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      className={`w-3.5 h-3.5 ${
                        starIdx < Math.floor(review.rating) 
                          ? "text-brand-orange fill-brand-orange" 
                          : "text-border"
                      }`} 
                    />
                  ))}
                  <span className="text-[11px] font-bold text-foreground ml-1.5">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic font-sans">
                  "{review.comment}"
                </p>
              </div>

              {/* User Bio Details Card Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <img
                  src={review.avatarUrl}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover select-none pointer-events-none border border-brand-teal/20"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground tracking-tight font-sans truncate">
                    {review.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    {review.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}