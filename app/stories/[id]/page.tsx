/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Card, Button, Chip } from "@heroui/react";
import { Compass, Heart, ArrowLeft, Calendar, BookOpen } from "@gravity-ui/icons";
import { getStoryById } from "@/lib/api/stories";
import Link from "next/link";
import { notFound } from "next/navigation";

interface StoryItem {
    _id: string;
    title: string;
    shortDescription: string;
    content: string;
    images: string[];
    destinationTag: string;
    likesCount: number;
    isFeatured: boolean;
    createdAt: string;
}

export default async function PublicStoryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let story: StoryItem | null = null;

    try {
        const response = await getStoryById(id);
        story = response?.data || response;
    } catch (err) {
        console.error(`Failed to pull dynamic story log contextual frame context for item ID: ${id}`, err);
    }

    if (!story || !story._id) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            {/* Top Navigation Row Anchor link context */}
            <div className="flex items-center justify-between">
                <Link href="/stories">
                    <Button size="sm" variant="light" className="rounded-xl text-zinc-600 dark:text-zinc-400 font-semibold">
                        <ArrowLeft size={16} /> Back to Discover feed
                    </Button>
                </Link>
                {story.isFeatured && (
                    <Chip size="sm" className="bg-amber-500 text-zinc-950 font-bold uppercase text-[9px] tracking-widest">
                        Featured Adventure
                    </Chip>
                )}
            </div>

            {/* Title & Metadata Sheet header box */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-teal-600 font-bold bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 px-2.5 py-1 rounded-full">
                        <Compass size={14} /> #{story.destinationTag}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-1 font-medium">
                        <Calendar size={14} /> Broadcasted on {new Date(story.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
                    {story.title}
                </h1>
                
                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                    {story.shortDescription}
                </p>
            </div>

            {/* Photo Gallery Canvas (Handles single or multiple URLs cleanly) */}
            {story.images && story.images.length > 0 && (
                <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="w-full max-h-(500px) rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                        <img 
                            src={story.images[0]} 
                            alt={story.title} 
                            className="w-full h-full object-cover max-h-[500px]"
                        />
                    </div>
                    {story.images.length > 1 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {story.images.slice(1).map((imgUrl, index) => (
                                <div key={index} className="h-28 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                                    <img src={imgUrl} alt={`Gallery asset slot ${index}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Core Narrative Text body block */}
            <Card className="p-8 sm:p-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl shadow-xs mt-6">
                <article className="prose dark:prose-invert max-w-none text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-8 font-normal space-y-6 whitespace-pre-wrap select-text">
                    {story.content}
                </article>

                {/* Engagement Footer element block layout */}
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                        <BookOpen size={16} className="text-zinc-400" />
                        <span className="text-xs font-semibold">End of Journal Narrative</span>
                    </div>
                    
                    <Button 
                        size="md" 
                        variant="flat" 
                        className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-bold rounded-xl px-5 flex items-center gap-2 border border-rose-100/50 dark:border-rose-950"
                    >
                        <Heart size={16} className="fill-current" /> Like Story ({story.likesCount})
                    </Button>
                </div>
            </Card>
        </div>
    );
}