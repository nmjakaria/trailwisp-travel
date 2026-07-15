/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, Table, Chip, toast, Modal } from "@heroui/react";
import { Star, TrashBin, CommentsDot, Compass } from "@gravity-ui/icons";
import { toggleBestComment, deleteComment } from "@/lib/api/comments";

interface CommentItem {
    _id: string;
    text: string;
    isBestComment: boolean;
    targetType: "place" | "story";
    createdAt: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
    targetId?: {
        _id: string;
        title: string; // The place title populated from the backend
    };
}

interface CommentsManagerViewProps {
    initialComments: CommentItem[];
}

export default function CommentsManagerView({
    initialComments,
}: CommentsManagerViewProps): React.JSX.Element {
    const [comments, setComments] = useState<CommentItem[]>(initialComments);
    const [isMutating, setIsMutating] = useState<string | null>(null);

    // Modal control state
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [targetComment, setTargetComment] = useState<{ id: string; targetId: string } | null>(null);

    // Toggle Best Comment Feature
    const handleToggleBest = async (commentId: string, targetId: string) => {
        setIsMutating(commentId);
        try {
            await toggleBestComment(commentId, targetId);
            
            // Optimistically update the UI state
            setComments((prev) =>
                prev.map((c) =>
                    c._id === commentId ? { ...c, isBestComment: !c.isBestComment } : c
                )
            );
            toast.success("Feature status updated successfully");
        } catch (err: any) {
            toast.warning(err.message || "Failed to update status");
        } finally {
            setIsMutating(null);
        }
    };

    // Trigger Delete Modal
    const initiateDeletion = (id: string, targetId: string) => {
        setTargetComment({ id, targetId });
        setIsModalOpen(true);
    };

    // Execute Delete
    const handleConfirmDelete = async () => {
        if (!targetComment) return;
        
        const { id, targetId } = targetComment;
        setIsModalOpen(false); // Instantly close modal
        setIsMutating(id);

        try {
            await deleteComment(id, targetId);
            setComments((prev) => prev.filter((c) => c._id !== id));
            toast.success("Comment deleted successfully");
        } catch (err: any) {
            toast.warning(err.message || "Failed to delete comment");
        } finally {
            setIsMutating(null);
            setTargetComment(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <CommentsDot className="text-teal-600" /> Manage Comments
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Moderate travel reviews, feature the best insights on place pages, or delete outdated spam.
                </p>
            </div>

            {comments.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                    <p className="text-sm text-zinc-500">No comments have been posted yet.</p>
                </Card>
            ) : (
                <Table className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Comments Administration Table">
                            <Table.Header>
                                <Table.Column isRowHeader className="font-bold text-zinc-500">USER</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">PLACE</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">COMMENT</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-center">FEATURED</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-right">ACTIONS</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {comments.map((comment) => {
                                    // Handle target ID both as a populated object or standard string fallback
                                    const targetIdString = typeof comment.targetId === "object" ? comment.targetId._id : comment.targetId || "";
                                    const placeTitle = typeof comment.targetId === "object" ? comment.targetId.title : "Destination Link";

                                    return (
                                        <Table.Row key={comment._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                            {/* User Details */}
                                            <Table.Cell className="align-top py-4">
                                                <div className="font-semibold text-zinc-900 dark:text-zinc-150">
                                                    {comment.userId?.name || "Anonymous Traveler"}
                                                </div>
                                                <div className="text-xs text-zinc-400">
                                                    {comment.userId?.email || "No Email Provided"}
                                                </div>
                                            </Table.Cell>

                                            {/* Target Place */}
                                            <Table.Cell className="align-top py-4">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600">
                                                    <Compass size={14} />
                                                    {placeTitle}
                                                </div>
                                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                                                    ID: {targetIdString.substring(0, 8)}...
                                                </span>
                                            </Table.Cell>

                                            {/* Comment Text */}
                                            <Table.Cell className="max-w-md align-top py-4">
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words leading-relaxed">
                                                    "{comment.text}"
                                                </p>
                                                <span className="text-[10px] text-zinc-400 block mt-1">
                                                    Posted on {new Date(comment.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                                </span>
                                            </Table.Cell>

                                            {/* Feature toggle (Best Comment badge/button) */}
                                            <Table.Cell className="text-center align-top py-4">
                                                <Button
                                                    size="sm"
                                                    variant={comment.isBestComment ? "solid" : "outline"}
                                                    className={`font-semibold rounded-xl text-xs gap-1.5 ${
                                                        comment.isBestComment 
                                                            ? "bg-amber-500 text-white" 
                                                            : "border-zinc-200 text-zinc-500 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                    }`}
                                                    onClick={() => handleToggleBest(comment._id, targetIdString)}
                                                    isLoading={isMutating === comment._id}
                                                >
                                                    <Star size={14} className={comment.isBestComment ? "fill-current" : ""} />
                                                    {comment.isBestComment ? "Best Review" : "Feature"}
                                                </Button>
                                            </Table.Cell>

                                            {/* Delete Action */}
                                            <Table.Cell className="text-right align-top py-4">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    onClick={() => initiateDeletion(comment._id, targetIdString)}
                                                    className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <TrashBin size={16} />
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            )}

            {/* Custom Modal with your explicit isOpen & onOpenChange rules */}
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
                                    Delete Comment
                                </Modal.Heading>
                                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                                    Are you sure you want to delete this comment? This action will permanently remove it from the destination's page.
                                </p>
                            </Modal.Header>

                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button 
                                    variant="secondary" 
                                    className="rounded-xl"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                                    onClick={handleConfirmDelete}
                                >
                                    Yes, Delete
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}