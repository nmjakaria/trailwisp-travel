/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Card, Button, Chip } from "@heroui/react";
import { Pencil, TrashBin, Star, StarFill } from "@gravity-ui/icons";

interface Place {
    _id: string;
    title: string;
    location: string;
    price: number;
    category: string;
    duration: string;
    images: string[];
    isFeatured?: boolean;
}

interface PlaceCardProps {
    place: Place;
    onToggleFeatured: (place: Place) => void;
    onDeleteClick: (place: Place) => void;
}

export default function PlaceCard({ place, onToggleFeatured, onDeleteClick }: PlaceCardProps) {
    return (
        <Card 
            className="group flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300"
        >
            {/* Card Display Header Wrapper */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img 
                    src={place.images?.[0] || "/placeholder-image.png"} 
                    alt={place.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    width={500}
                    height={300}
                    
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <Chip className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-zinc-200 font-bold text-[10px] px-2.5 h-6 backdrop-blur-sm shadow-sm">
                        {place.category}
                    </Chip>
                    <Chip className="bg-zinc-900/80 text-white font-bold text-[10px] px-2.5 h-6 backdrop-blur-sm">
                        {place.duration}
                    </Chip>
                </div>

                {/* Star Toggle Action Hook Trigger */}
                <button
                    onClick={() => onToggleFeatured(place)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-900 shadow-sm hover:scale-105 active:scale-95 transition-all rounded-full group/star"
                    title={place.isFeatured ? "Remove from Featured Spotlight" : "Feature this Destination Spot"}
                >
                    {place.isFeatured ? (
                        <StarFill className="size-4 text-amber-500" />
                    ) : (
                        <Star className="size-4 text-zinc-400 group-hover/star:text-amber-500 transition-colors" />
                    )}
                </button>
            </div>

            {/* Center Panel Core Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1">{place.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{place.location}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">Base Price</span>
                        <span className="text-lg font-black text-teal-600 dark:text-teal-400">${place.price}</span>
                    </div>

                    {/* Component Action Footers Menu */}
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/places/edit/${place._id}`}>
                            <Button 
                                isIconOnly 
                                variant="outline" 
                                size="sm" 
                                className="border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 size-9 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                title="Edit Destination Specs"
                            >
                                <Pencil size={15} />
                            </Button>
                        </Link>
                        
                        <Button 
                            isIconOnly 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl text-red-500 size-9 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                            onClick={() => onDeleteClick(place)}
                            title="Delete item permanently"
                        >
                            <TrashBin size={15} />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}