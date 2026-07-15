import React from "react";
import { Card, Button, Chip } from "@heroui/react";
import { Compass, Heart, Magnifier, Calendar, EyesLookRight } from "@gravity-ui/icons";
import { getStories } from "@/lib/api/stories";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StoryItem {
    _id: string;
    title: string;
    shortDescription: string;
    images: string[];
    destinationTag: string;
    likesCount: number;
    isFeatured: boolean;
    createdAt: string;
}

interface SearchParams {
    search?: string;
    destinationTag?: string;
    sort?: string;
}

export default async function PublicStoriesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const resolvedParams = await searchParams;
    
    // Fallback parameters injection
    const query = {
        search: resolvedParams.search || "",
        destinationTag: resolvedParams.destinationTag || "",
        sort: resolvedParams.sort || "-createdAt",
    };

    let stories: StoryItem[] = [];
    try {
        const response = await getStories(query);
        stories = Array.isArray(response) ? response : response?.data || [];
    } catch (err) {
        console.error("Public feeds down:", err);
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl space-y-8">
            {/* Header Identity banner section */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                    Shared Travel Chronicles
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Explore raw journals, destination itineraries, and epic logs broadcasted by travelers worldwide.
                </p>
            </div>

            {/* Filter Pipeline Controls Bar */}
            <Card className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs">
                <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative flex items-center">
                        <Magnifier className="absolute left-3 text-zinc-400" size={16} />
                        <input
                            type="text"
                            name="search"
                            defaultValue={query.search}
                            placeholder="Search titles or logs..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                        />
                    </div>
                    
                    <div className="relative flex items-center">
                        <Compass className="absolute left-3 text-zinc-400" size={16} />
                        <input
                            type="text"
                            name="destinationTag"
                            defaultValue={query.destinationTag}
                            placeholder="Filter by #tag (e.g. cox-bazar)..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            name="sort"
                            defaultValue={query.sort}
                            className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600 text-zinc-600 dark:text-zinc-400"
                        >
                            <option value="-createdAt">Latest Uploads</option>
                            <option value="-likesCount">Most Popular</option>
                        </select>
                        <Button type="submit" size="sm" className="bg-teal-600 text-white font-bold rounded-xl px-5">
                            Apply
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Grid display layout logic */}
            {stories.length === 0 ? (
                <Card className="p-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl">
                    <p className="text-sm text-zinc-500 font-medium">No chronicles found matching your filter combinations.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Card 
                            key={story._id} 
                            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xs flex flex-col h-full"
                        >
                            {/* Card Image Area wrapper */}
                            <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden shrink-0 border-b border-zinc-100 dark:border-zinc-800/60">
                                {story.images && story.images.length > 0 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={story.images[0]} 
                                        alt={story.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                        <Compass size={40} strokeWidth={1} />
                                    </div>
                                )}
                                
                                {story.isFeatured && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <Chip size="sm" className="bg-amber-500 text-zinc-950 font-bold text-[9px] uppercase tracking-wider">
                                            Featured
                                        </Chip>
                                    </div>
                                )}
                            </div>

                            {/* Info Area body context */}
                            <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-teal-600 tracking-wide">
                                            #{story.destinationTag}
                                        </span>
                                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(story.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-teal-600 transition-colors">
                                        {story.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                                        {story.shortDescription}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                                    <span className="inline-flex items-center gap-1 font-bold text-rose-500">
                                        <Heart size={14} className="fill-current" /> {story.likesCount}
                                    </span>
                                    <Link href={`/stories/${story._id}`}>
                                        <Button size="sm" variant="light" className="text-teal-600 font-bold rounded-lg p-0 h-auto hover:bg-transparent">
                                            Read Story <EyesLookRight size={14} className="ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}