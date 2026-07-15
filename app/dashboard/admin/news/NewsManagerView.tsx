/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, Table, Chip, toast, Modal } from "@heroui/react";
import { TrashBin, Megaphone, Plus, Link as LinkIcon } from "@gravity-ui/icons";
import { createNews, deleteNews, NewsInput } from "@/lib/api/news";

interface NewsItem extends NewsInput {
    _id: string;
    createdAt: string;
}

interface NewsManagerViewProps {
    initialNews: NewsItem[];
}

export default function NewsManagerView({ initialNews }: NewsManagerViewProps): React.JSX.Element {
    const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
    const [isMutating, setIsMutating] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Modal control state
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [targetNewsId, setTargetNewsId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [badgeText, setBadgeText] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    // Handle Form submission
    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            toast.warning("Title and content are required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createNews({ title, content, badgeText, linkUrl });
            setNewsList((prev) => [result.data, ...prev]);
            toast.success("News bulletin broadcasted successfully");
            
            // Reset form fields
            setTitle("");
            setContent("");
            setBadgeText("");
            setLinkUrl("");
        } catch (err: any) {
            toast.error(err.message || "Failed to post update");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Trigger Deletion Modal
    const initiateDeletion = (id: string) => {
        setTargetNewsId(id);
        setIsModalOpen(true);
    };

    // Execute Delete Action
    const handleConfirmDelete = async () => {
        if (!targetNewsId) return;
        setIsModalOpen(false);
        setIsMutating(targetNewsId);

        try {
            await deleteNews(targetNewsId);
            setNewsList((prev) => prev.filter((item) => item._id !== targetNewsId));
            toast.success("News item removed successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to remove item");
        } finally {
            setIsMutating(null);
            setTargetNewsId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Megaphone className="text-teal-600" /> System News Broadcasts
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Post banner updates, urgent notices, or discounts directly onto the homepage announcement marquee.
                </p>
            </div>

            {/* Quick Create Panel */}
            <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs">
                <form onSubmit={handleCreateNews} className="space-y-4">
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Draft New Alert</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <input
                                type="text"
                                placeholder="Alert Headline (e.g., Flash Sale live now!)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Badge text (e.g., HOT, SALE)"
                                value={badgeText}
                                onChange={(e) => setBadgeText(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <textarea
                            placeholder="Detailed message content context..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600 resize-none"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                        <input
                            type="text"
                            placeholder="Redirect Destination Path / Url (Optional)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full sm:max-w-md px-4 py-1.5 text-xs border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 rounded-xl outline-hidden focus:border-teal-600"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="w-full sm:w-auto bg-teal-600 text-white font-semibold rounded-xl"
                            isLoading={isSubmitting}
                        >
                            <Plus size={14} /> Publish Broadcast
                        </Button>
                    </div>
                </form>
            </Card>

            {/* List Table */}
            {newsList.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                    <p className="text-sm text-zinc-500">No active news feeds currently active.</p>
                </Card>
            ) : (
                <Table className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="News Broadcasts Configuration Table">
                            <Table.Header>
                                <Table.Column isRowHeader className="font-bold text-zinc-500">HEADLINE</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">CONTENT</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">TAG</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-right">ACTIONS</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {newsList.map((item) => (
                                    <Table.Row key={item._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                        <Table.Cell className="font-semibold text-zinc-900 dark:text-zinc-150 py-4">
                                            <div>{item.title}</div>
                                            {item.linkUrl && (
                                                <div className="text-[11px] text-teal-600 flex items-center gap-1 mt-0.5 font-medium">
                                                    <LinkIcon size={12} /> {item.linkUrl}
                                                </div>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="max-w-sm text-zinc-600 dark:text-zinc-400 text-xs py-4">
                                            <p className="line-clamp-2">{item.content}</p>
                                        </Table.Cell>
                                        <Table.Cell className="py-4">
                                            {item.badgeText ? (
                                                <Chip size="sm" color="warning" variant="flat" className="font-bold text-[9px] uppercase tracking-wide">
                                                    {item.badgeText}
                                                </Chip>
                                            ) : (
                                                <span className="text-zinc-400 text-xs">—</span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="text-right py-4">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onClick={() => initiateDeletion(item._id)}
                                                isLoading={isMutating === item._id}
                                                className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                            >
                                                <TrashBin size={16} />
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            )}

            {/* Custom Modal configuration pattern */}
            <Modal 
                isOpen={isModalOpen} 
                onOpenChange={(open: boolean) => { if (!open) setIsModalOpen(false); }}
            >
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />
                            <Modal.Header className="p-6 pb-2">
                                <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    Remove Announcement
                                </Modal.Heading>
                                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                                    Are you sure you want to delete this alert broadcast? This will immediately remove it from the homepage feed display.
                                </p>
                            </Modal.Header>
                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button variant="secondary" className="rounded-xl" onClick={() => setIsModalOpen(false)}>
                                    Dismiss
                                </Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl" onClick={handleConfirmDelete}>
                                    Confirm Delete
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}