/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Clock, MapPin, StarFill } from "@gravity-ui/icons";

interface PlaceCardProps {
    place: {
        _id: string;
        title: string;
        location: string;
        price: number;
        category: string;
        duration: string;
        images: string[];
        rating?: number;
        shortDescription?: string;
    };
}

export default function DestinationCard({ place }: PlaceCardProps) {
    // Graceful fallback for the image banner asset
    const displayImage = place.images && place.images.length > 0 
        ? place.images[0] 
        : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";

    return (
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            
            {/* Image Box Wrapper */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img 
                    src={displayImage} 
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                
                {/* Dynamic Floating Category Badge tag */}
                <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm border border-zinc-100/20">
                    {place.category}
                </span>

                {/* Rating Overlay badge */}
                {place.rating !== undefined && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-sm">
                        <StarFill className="size-3.5" />
                        {Number(place.rating).toFixed(1)}
                    </div>
                )}
            </div>

            {/* Typography Description Panel Meta Stack */}
            <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-xs font-semibold">
                        <MapPin className="size-3.5 shrink-0 text-teal-600/70" />
                        <span className="truncate">{place.location}</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-teal-600 transition-colors">
                        {place.title}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed font-normal">
                        {place.shortDescription || "Embark on an iconic custom exploration footprint travel journey curated exactly around your holiday dreams."}
                    </p>
                </div>

                {/* Action Frame Row */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <div>
                        <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pricing Starting At</span>
                        <div className="text-base font-black text-zinc-900 dark:text-zinc-50">
                            ৳{place.price.toLocaleString("en-BD")}
                        </div>
                    </div>

                    <Link href={`/destinations/${place._id}`}>
                        <Button className="bg-zinc-900 dark:bg-zinc-800 hover:bg-teal-600 dark:hover:bg-teal-600 text-white text-xs font-bold rounded-xl px-4 h-9 shadow-sm transition-all duration-200">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}