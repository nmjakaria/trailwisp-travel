/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, toast } from "@heroui/react";
import { ArrowLeft, Check, Picture, TrashBin } from "@gravity-ui/icons";
import { updateStory } from "@/lib/api/stories";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StoryItem {
    _id: string;
    title: string;
    shortDescription: string;
    content: string;
    images: string[];
    destinationTag: string;
}

interface AdminEditStoryViewProps {
    story: StoryItem;
}

export default function AdminEditStoryView({
    story,
}: AdminEditStoryViewProps): React.JSX.Element {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Override Data State values
    const [title, setTitle] = useState(story.title);
    const [destinationTag, setDestinationTag] = useState(story.destinationTag);
    const [shortDescription, setShortDescription] = useState(story.shortDescription);
    const [content, setContent] = useState(story.content);
    
    // Dynamic array handling for string image URLs
    const [imageUrlInput, setImageUrlInput] = useState("");
    const [images, setImages] = useState<string[]>(story.images || []);

    const handleAddImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        if (!imageUrlInput.startsWith("http")) {
            toast.warning("Must provide valid image url link location.");
            return;
        }
        setImages((prev) => [...prev, imageUrlInput.trim()]);
        setImageUrlInput("");
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleOverrideSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            await updateStory(story._id, {
                title,
                destinationTag: destinationTag.replace("#", "").trim(),
                shortDescription,
                content,
                images,
            });

            toast.success("Database entry updated with admin overrides.");
            router.push("/dashboard/admin/stories");
        } catch (err: any) {
            toast.error(err.message || "Override transaction declined.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/admin/stories">
                    <Button isIconOnly variant="light" size="sm" className="rounded-xl">
                        <ArrowLeft size={16} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        Admin Editing Override Panel
                    </h1>
                    <p className="text-xs text-zinc-400">Moderating Article: {story._id}</p>
                </div>
            </div>

            {/* Input Sheet */}
            <Card className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl">
                <form onSubmit={handleOverrideSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-zinc-400">Headline Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-amber-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-400">Destination Tag</label>
                            <input
                                type="text"
                                value={destinationTag}
                                onChange={(e) => setDestinationTag(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-amber-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Teaser Short Description</label>
                        <input
                            type="text"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Article Content Narrative</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            required
                            className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-amber-500 resize-none leading-relaxed"
                        />
                    </div>

                    {/* Admin Image Moderation */}
                    <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <label className="text-xs font-bold text-zinc-400 block">Manage Asset Image Links</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste clean direct image url (https://...)"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-amber-500"
                            />
                            <Button type="button" size="sm" onClick={handleAddImageUrl} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl px-4">
                                Add Url
                            </Button>
                        </div>

                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {images.map((url, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 pl-3 pr-1.5 py-1 rounded-xl max-w-xs">
                                        <Picture size={12} className="text-amber-500 shrink-0" />
                                        <span className="truncate text-zinc-600 dark:text-zinc-400 font-mono text-[10px]">{url}</span>
                                        <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-500 hover:text-red-700 font-bold px-1 rounded-md shrink-0">
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Controls */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Link href="/dashboard/admin/stories">
                            <Button type="button" variant="secondary" className="rounded-xl">
                                Cancel Mod
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl px-6"
                            isLoading={isSubmitting}
                        >
                            <Check size={14} /> Commit Changes
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    );
}