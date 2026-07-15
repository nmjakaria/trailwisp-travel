/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, Table, Chip, toast, Modal } from "@heroui/react";
import { TrashBin, Pencil, BookOpen, Plus, Heart, Compass } from "@gravity-ui/icons";
import { updateStory, deleteStory } from "@/lib/api/stories";
import Link from "next/link";

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

interface StoryManagementViewProps {
    initialStories: StoryItem[];
}

export default function StoryManagementView({
    initialStories,
}: StoryManagementViewProps): React.JSX.Element {
    const [stories, setStories] = useState<StoryItem[]>(initialStories);
    const [isMutating, setIsMutating] = useState<string | null>(null);

    // Modals Control
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [targetStory, setTargetStory] = useState<StoryItem | null>(null);

    // Form states for inline editing
    const [editTitle, setEditTitle] = useState("");
    const [editShortDesc, setEditShortDesc] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editTag, setEditTag] = useState("");

    // Setup Edit State values
    const handleOpenEdit = (story: StoryItem) => {
        setTargetStory(story);
        setEditTitle(story.title);
        setEditShortDesc(story.shortDescription);
        setEditContent(story.content);
        setEditTag(story.destinationTag);
        setIsEditOpen(true);
    };

    // Execute Update
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetStory) return;

        setIsEditOpen(false);
        setIsMutating(targetStory._id);

        const payload = {
            title: editTitle,
            shortDescription: editShortDesc,
            content: editContent,
            destinationTag: editTag,
        };

        try {
            await updateStory(targetStory._id, payload);
            setStories((prev) =>
                prev.map((s) => (s._id === targetStory._id ? { ...s, ...payload } : s))
            );
            toast.success("Travel story updated successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to save edits");
        } finally {
            setIsMutating(null);
            setTargetStory(null);
        }
    };

    // Setup Delete Confirm
    const initiateDeletion = (story: StoryItem) => {
        setTargetStory(story);
        setIsDeleteOpen(true);
    };

    // Execute Delete
    const handleConfirmDelete = async () => {
        if (!targetStory) return;

        setIsDeleteOpen(false);
        setIsMutating(targetStory._id);

        try {
            await deleteStory(targetStory._id);
            setStories((prev) => prev.filter((s) => s._id !== targetStory._id));
            toast.success("Story removed successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to remove story");
        } finally {
            setIsMutating(null);
            setTargetStory(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Row Context */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <BookOpen className="text-teal-600" /> My Published Stories
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Manage your journals, descriptions, and pinned adventures.
                    </p>
                </div>
                <Link href="/dashboard/user/stories/add">
                    <Button size="sm" className="bg-teal-600 text-white font-semibold rounded-xl">
                        <Plus size={14} /> Write A Story
                    </Button>
                </Link>
            </div>

            {stories.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                    <p className="text-sm text-zinc-500">You haven't shared any travel logs yet.</p>
                </Card>
            ) : (
                <Table className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Personal Stories List View Table">
                            <Table.Header>
                                <Table.Column isRowHeader className="font-bold text-zinc-500">STORY</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">DESTINATION TAG</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-center">ENGAGEMENT</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-center">STATUS</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-right">ACTIONS</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {stories.map((story) => (
                                    <Table.Row key={story._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                        <Table.Cell className="py-4 max-w-xs">
                                            <div className="font-semibold text-zinc-900 dark:text-zinc-150 line-clamp-1">{story.title}</div>
                                            <div className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{story.shortDescription}</div>
                                        </Table.Cell>
                                        <Table.Cell className="py-4">
                                            <span className="flex items-center gap-1.5 text-xs text-teal-600 font-semibold">
                                                <Compass size={14} /> #{story.destinationTag}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-center py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500">
                                                <Heart size={12} className="fill-current" /> {story.likesCount}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-center py-4">
                                            {story.isFeatured && (
                                                <Chip size="sm" color="amber" variant="flat" className="font-bold text-[9px] uppercase tracking-wide">
                                                    Featured
                                                </Chip>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="text-right py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onClick={() => handleOpenEdit(story)}
                                                    isLoading={isMutating === story._id}
                                                    className="rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                                                >
                                                    <Pencil size={16} />
                                                </Button>
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

            {/* Modal: Edit Story */}
            <Modal isOpen={isEditOpen} onOpenChange={(open: boolean) => { if (!open) setIsEditOpen(false); }}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />
                            <form onSubmit={handleSaveEdit}>
                                <Modal.Header className="p-6 pb-2">
                                    <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Modify Travel Journal</Modal.Heading>
                                </Modal.Header>
                                <div className="p-6 pt-2 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-400">Headline Title</label>
                                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-400">Destination Location Tag</label>
                                        <input type="text" value={editTag} onChange={(e) => setEditTag(e.target.value)} required className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-400">Brief Overview Description</label>
                                        <input type="text" value={editShortDesc} onChange={(e) => setEditShortDesc(e.target.value)} required className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-400">Full Journal Narrative</label>
                                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={4} required className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600 resize-none"/>
                                    </div>
                                </div>
                                <Modal.Footer className="p-6 pt-2 flex gap-2 justify-end">
                                    <Button variant="secondary" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-teal-600 text-white font-bold rounded-xl">Save Changes</Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            {/* Modal: Confirm Delete */}
            <Modal isOpen={isDeleteOpen} onOpenChange={(open: boolean) => { if (!open) setIsDeleteOpen(false); }}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />
                            <Modal.Header className="p-6 pb-2">
                                <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Delete Journal Entry</Modal.Heading>
                                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">Are you certain you want to remove this memory from your dashboard profile? This cannot be undone.</p>
                            </Modal.Header>
                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button variant="secondary" className="rounded-xl" onClick={() => setIsDeleteOpen(false)}>Dismiss</Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl" onClick={handleConfirmDelete}>Confirm Delete</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}