/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, Table, Chip, toast, Modal } from "@heroui/react";
import { TrashBin, Pencil, Star, StarFill, Compass, Heart, Magnifier } from "@gravity-ui/icons";
import { deleteStory, toggleFeatureStory } from "@/lib/api/stories";
import Link from "next/link";

interface StoryItem {
    _id: string;
    title: string;
    shortDescription: string;
    destinationTag: string;
    likesCount: number;
    isFeatured: boolean;
    createdAt: string;
}

interface AdminStoryManagementViewProps {
    initialStories: StoryItem[];
}

export default function AdminStoryManagementView({
    initialStories,
}: AdminStoryManagementViewProps): React.JSX.Element {
    const [stories, setStories] = useState<StoryItem[]>(initialStories);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMutating, setIsMutating] = useState<string | null>(null);

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [targetStory, setTargetStory] = useState<StoryItem | null>(null);

    // Filter stories based on simple search
    const filteredStories = stories.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.destinationTag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Toggle Featured Action (Using Admin toggle action)
    const handleToggleFeature = async (story: StoryItem) => {
        setIsMutating(story._id);
        const originalStatus = story.isFeatured;

        // Optimistic UI Update
        setStories((prev) =>
            prev.map((s) => (s._id === story._id ? { ...s, isFeatured: !originalStatus } : s))
        );

        try {
            // Note: Directly hitting the PATCH /api/stories/:id/feature backend route
            const response = await toggleFeatureStory(story._id);

            if (!response.ok) throw new Error("Feature action rejected by API");
            
            toast.success(
                originalStatus 
                    ? "Story removed from features" 
                    : "Story prominently featured on landing pages!"
            );
        } catch (err: any) {
            // Revert on error
            setStories((prev) =>
                prev.map((s) => (s._id === story._id ? { ...s, isFeatured: originalStatus } : s))
            );
            toast.warning(err.message || "Authorization failed or route unreachable.");
        } finally {
            setIsMutating(null);
        }
    };

    // Prepare Deletion
    const initiateDeletion = (story: StoryItem) => {
        setTargetStory(story);
        setIsDeleteOpen(true);
    };

    // Execute Deletion
    const handleConfirmDelete = async () => {
        if (!targetStory) return;

        setIsDeleteOpen(false);
        setIsMutating(targetStory._id);

        try {
            await deleteStory(targetStory._id);
            setStories((prev) => prev.filter((s) => s._id !== targetStory._id));
            toast.success("Travel memory successfully purged from the database.");
        } catch (err: any) {
            toast.error(err.message || "Failed to remove database entry.");
        } finally {
            setIsMutating(null);
            setTargetStory(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        Global Story Moderation
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Manage all community articles, delete violations, and highlight stories to feature.
                    </p>
                </div>
            </div>

            {/* Quick Search Filtering Tool */}
            <Card className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs">
                <div className="relative flex items-center max-w-md">
                    <Magnifier className="absolute left-3 text-zinc-400" size={16} />
                    <input
                        type="text"
                        placeholder="Filter by title or destination tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-amber-500"
                    />
                </div>
            </Card>

            {/* Stories Interactive Moderation Table */}
            {filteredStories.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl">
                    <p className="text-sm text-zinc-500">No stories found matching filters.</p>
                </Card>
            ) : (
                <Table className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Database Story Master Logs Table">
                            <Table.Header>
                                <Table.Column isRowHeader className="font-bold text-zinc-500">ARTICLE INFO</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">TAG</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-center">ENGAGEMENT</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-center">PINNED FEATURE</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-right">MODERATE</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {filteredStories.map((story) => (
                                    <Table.Row key={story._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                        <Table.Cell className="py-4 max-w-sm">
                                            <div className="font-semibold text-zinc-900 dark:text-zinc-150 line-clamp-1">{story.title}</div>
                                            <div className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{story.shortDescription}</div>
                                        </Table.Cell>
                                        <Table.Cell className="py-4">
                                            <span className="text-xs font-semibold text-zinc-500">
                                                #{story.destinationTag}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-center py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500">
                                                <Heart size={12} className="fill-current" /> {story.likesCount}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-center py-4">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onClick={() => handleToggleFeature(story)}
                                                isLoading={isMutating === story._id}
                                                className={`rounded-lg transition-colors ${
                                                    story.isFeatured 
                                                        ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20" 
                                                        : "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100"
                                                }`}
                                            >
                                                {story.isFeatured ? <StarFill size={16} /> : <Star size={16} />}
                                            </Button>
                                        </Table.Cell>
                                        <Table.Cell className="text-right py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/dashboard/admin/stories/${story._id}`}>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    onClick={() => initiateDeletion(story)}
                                                    isLoading={isMutating === story._id}
                                                    className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <TrashBin size={16} />
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            )}

            {/* Modal: Confirm Global Force Delete */}
            <Modal isOpen={isDeleteOpen} onOpenChange={(open: boolean) => { if (!open) setIsDeleteOpen(false); }}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />
                            <Modal.Header className="p-6 pb-2">
                                <Modal.Heading className="text-xl font-bold text-red-600">Administrative Force Delete</Modal.Heading>
                                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                                    You are removing a community post as an Administrator. This completely deletes the story memory database asset.
                                </p>
                            </Modal.Header>
                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button variant="secondary" className="rounded-xl" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl" onClick={handleConfirmDelete}>Purge Story</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}