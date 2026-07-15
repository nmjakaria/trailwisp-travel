/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, toast } from "@heroui/react";
import { BookOpen, Plus, ArrowLeft, Picture } from "@gravity-ui/icons";
import { createStory } from "@/lib/api/stories";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddStoryPage(): React.JSX.Element {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Schema matched form entries
    const [title, setTitle] = useState("");
    const [destinationTag, setDestinationTag] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState("");
    
    // Dynamic array handling for string image URLs
    const [imageUrlInput, setImageUrlInput] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const handleAddImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        if (!imageUrlInput.startsWith("http")) {
            toast.warning("Please provide a valid image URL link starting with http/https");
            return;
        }
        setImages((prev) => [...prev, imageUrlInput.trim()]);
        setImageUrlInput("");
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmitStory = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !destinationTag.trim() || !shortDescription.trim() || !content.trim()) {
            toast.warning("Please fill out all mandatory schema values.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createStory({
                title,
                destinationTag: destinationTag.replace("#", "").trim(),
                shortDescription,
                content,
                images,
            });

            toast.success("Travel memory uploaded successfully!");
            router.push("/dashboard/user/stories");
        } catch (err: any) {
            toast.error(err.message || "Failed to publish travel journal entry");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Nav Header Row */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/user/stories">
                    <Button isIconOnly variant="light" size="sm" className="rounded-xl">
                        <ArrowLeft size={16} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <BookOpen size={18} className="text-teal-600" /> Draft Travel Log
                    </h1>
                </div>
            </div>

            {/* Main Workspace Sheet */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs">
                <form onSubmit={handleSubmitStory} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Story Title *</label>
                            <input
                                type="text"
                                placeholder="e.g., A Magical Weekend in Cox's Bazar"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Destination Tag *</label>
                            <input
                                type="text"
                                placeholder="e.g., cox-bazar"
                                value={destinationTag}
                                onChange={(e) => setDestinationTag(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Short Description Summary *</label>
                        <input
                            type="text"
                            placeholder="Provide a quick one or two sentence teaser hook for cards..."
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Story Content Narrative *</label>
                        <textarea
                            placeholder="Share the full timeline of your journey, tips, routes, hotel reviews, and custom details..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600 resize-none leading-relaxed"
                        />
                    </div>

                    {/* Image Collection Pipeline Box */}
                    <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Gallery Photo URL Links (Optional)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste image link location URL (https://...)"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                            />
                            <Button type="button" size="sm" onClick={handleAddImageUrl} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl px-4">
                                Add
                            </Button>
                        </div>

                        {/* Visual asset pill anchors */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {images.map((url, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 pl-3 pr-1.5 py-1 rounded-xl group max-w-xs">
                                        <Picture size={12} className="text-teal-600 shrink-0" />
                                        <span className="truncate text-zinc-600 dark:text-zinc-400 font-mono text-[10px]">{url}</span>
                                        <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-500 hover:text-red-700 font-bold px-1 rounded-md shrink-0">
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Trigger Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Link href="/dashboard/user/stories">
                            <Button type="button" variant="secondary" className="rounded-xl">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            className="bg-teal-600 text-white font-bold rounded-xl px-6"
                            isLoading={isSubmitting}
                        >
                            <Plus size={14} /> Publish Story
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    );
}