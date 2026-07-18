"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@heroui/react";
import { MapPin, Star, Heart, ArrowUpRight, Sparkles, Clock } from "lucide-react";
import Link from "next/link";

// MongoDB Schema TypeScript Definitions
interface BSONId {
  $oid: string;
}

interface BSONDate {
  $date: string;
}

interface Place {
  _id: BSONId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  location: string;
  category: string;
  duration: string;
  availableDates: BSONDate[];
  rating: number;
  likesCount: number;
  bookingsCount: number;
  isFeatured: boolean;
  createdBy: BSONId;
  createdAt: BSONDate;
  updatedAt: BSONDate;
  __v: number;
}

interface FeaturedPlacesClientProps {
  initialPlaces: Place[];
}

export default function FeaturedPlacesClient({ initialPlaces }: FeaturedPlacesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Dynamically group distinct categories out of your current DB objects
  const dynamicCategories = useMemo(() => {
    const categories = new Set(initialPlaces.map((p) => p.category));
    return ["all", ...Array.from(categories)];
  }, [initialPlaces]);

  // Client-side quick filter targeting schema categories
  const filteredPlaces = useMemo(() => {
    if (activeCategory === "all") return initialPlaces;
    return initialPlaces.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, initialPlaces]);

  const toggleWishlist = (id: string): void => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (!initialPlaces || initialPlaces.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      
      {/* Header Navigation Controls Block */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
            <Sparkles className="w-3 h-3" />
            Verified Destinations
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground font-display">
            Featured Experiences
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl font-sans">
            Handpicked getaways tailored for remarkable architecture, local atmosphere, and seamless booking timelines.
          </p>
        </div>

        {/* Dynamic Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
          {dynamicCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                activeCategory === category
                  ? "bg-brand-slate text-background border-brand-slate shadow-sm"
                  : "bg-card-bg text-muted-foreground border-border hover:border-brand-teal/40 hover:text-brand-teal"
              }`}
            >
              {category === "all" ? "View All" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Places Cards Grid Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place) => {
          const placeId: string = place._id;
          const isLiked = wishlist.includes(placeId);
          const primaryImage = place.images?.[0] || "/api/placeholder/400/300";

          return (
            <article 
              key={placeId}
              className="trailwisp-card overflow-hidden group" 
            >
              {/* Media Container Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-secondary">
                <img
                  src={primaryImage}
                  alt={place.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                
                {/* Floating Rating Badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="backdrop-blur-md bg-brand-slate/80 text-background text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <Star className="w-3 h-3 text-brand-orange fill-brand-orange shrink-0" />
                    {place.rating > 0 ? place.rating.toFixed(2) : "New"}
                  </span>
                </div>

                {/* Wishlist Heart Core Action */}
                {/* <div className="absolute top-4 right-4 z-10">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(placeId)}
                    className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border border-border shadow-sm text-foreground transform active:scale-90 hover:scale-105 transition-all pointer-events-auto cursor-pointer"
                    aria-label="Toggle item wishlist status"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isLiked ? "fill-brand-orange text-brand-orange" : "text-muted-foreground"
                      }`} 
                    />
                  </button>
                </div> */}

                {/* Category Floating Item Badge */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md bg-brand-teal text-white shadow-sm">
                    {place.category}
                  </span>
                </div>
              </div>

              {/* Informational Payload Meta Fields */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground text-xs font-semibold font-sans">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      <span className="truncate">{place.location}</span>
                    </div>
                    {place.duration && (
                      <div className="flex items-center gap-1 shrink-0 text-brand-teal bg-brand-teal/5 px-2 py-0.5 rounded-md text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{place.duration}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground font-display group-hover:text-brand-teal transition-colors duration-200 line-clamp-1">
                    {place.title}
                  </h3>

                  <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed">
                    {place.shortDescription}
                  </p>
                </div>

                {/* Action Row & Local Database Pricing Layout */}
                <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-baseline">
                      <span className="text-xl font-black text-foreground tracking-tight font-sans">
                        ৳{place.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-bold uppercase ml-0.5">
                        / Person
                      </span>
                    </div>
                    <span className="text-[9px] font-medium text-muted-foreground">
                      Base rate excludes processing
                    </span>
                  </div>

                  <Link
                    href={`/destinations/${placeId}`}>
                      <Button
                        size="sm"
                        className="font-bold text-xs rounded-xl bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white border border-brand-teal/20 transition-all duration-300 shadow-none"
                      >
                        Book Escape <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}