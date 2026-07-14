"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Surface, TextField, Label } from "@heroui/react";
import { CommentPlus, StarFill, TrashBin } from "@gravity-ui/icons";
import { getCommentsForTarget, createComment, deleteComment } from "@/lib/api/comments";

interface Comment {
    _id: string;
    userId: { _id: string; name?: string; email?: string } | string;
    text: string;
    isBestComment: boolean;
    createdAt: string;
}

interface CommentSectionProps {
    targetId: string;
    currentUserId?: string; 
}

export default function CommentSection({ targetId, currentUserId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
    const [newCommentText, setNewCommentText] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const loadComments = React.useCallback(async () => {
        try {
            const res = await getCommentsForTarget(targetId);
            const data = res?.data || (Array.isArray(res) ? res : []);
            setComments(data);
        } catch (err) {
            console.error("Failed to load targets comment array:", err);
        }
    }, [targetId]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            setIsSubmitting(true);
            await createComment({
                targetId,
                targetType: "place",
                text: newCommentText.trim()
            });
            setNewCommentText("");
            setIsCommentModalOpen(false);
            loadComments();
        } catch (err) {
            console.error("Failed executing target comment request mapping:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await deleteComment(commentId, targetId);
            loadComments();
        } catch (err) {
            console.error("Failed to invalidate matching commentary key:", err);
        }
    };

    return (
        <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <CommentPlus className="text-teal-600 size-5" /> Discussions ({comments.length})
                </h3>
                <Button 
                    size="sm" 
                    className="bg-teal-600 text-white font-bold rounded-xl text-xs"
                    onClick={() => setIsCommentModalOpen(true)}
                >
                    Write Comment
                </Button>
            </div>

            {comments.length === 0 ? (
                <p className="text-xs text-zinc-400 py-4 bg-zinc-50 dark:bg-zinc-900/20 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    No active feedback tracks registered on this profile framework.
                </p>
            ) : (
                <div className="space-y-3">
                    {comments.map((c) => {
                        const commenterId = typeof c.userId === "object" ? c.userId?._id : c.userId;
                        const commenterName = typeof c.userId === "object" ? c.userId?.name || "Explorer" : "Explorer";
                        const canDelete = currentUserId && commenterId === currentUserId;

                        return (
                            <div 
                                key={c._id} 
                                className={`p-4 rounded-2xl border relative transition-all ${
                                    c.isBestComment 
                                        ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30" 
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{commenterName}</span>
                                        {c.isBestComment && (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                                                <StarFill className="size-2.5" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-zinc-400">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 pr-8">{c.text}</p>
                                
                                {canDelete && (
                                    <button 
                                        onClick={() => handleDelete(c._id)}
                                        className="absolute right-3 bottom-3 text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <TrashBin className="size-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Comment Write Modal Overlay Layout Using Composite API */}
            <Modal isOpen={isCommentModalOpen} onOpenChange={(open: boolean) => { if (!open) setIsCommentModalOpen(false); }}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />
                            
                            <Modal.Header className="p-6 pb-2">
                                <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    Share Your Experience
                                </Modal.Heading>
                                <p className="mt-1.5 text-sm leading-5 text-zinc-400">
                                    Provide clear feedback notes concerning this deployment framework asset.
                                </p>
                            </Modal.Header>

                            <Modal.Body className="px-6 py-2">
                                <Surface variant="default" className="bg-transparent shadow-none border-0 p-0">
                                    <form id="modal-comment-form" onSubmit={handleCreateComment} className="flex flex-col gap-4">
                                        <TextField className="w-full" name="commentText" variant="secondary">
                                            <Label className="text-xs font-semibold mb-1 block text-zinc-500">Review / Commentary text</Label>
                                            <Input 
                                                placeholder="Type your honest experience notes here..." 
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                required
                                            />
                                        </TextField>
                                    </form>
                                </Surface>
                            </Modal.Body>

                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button 
                                    variant="secondary" 
                                    className="rounded-xl"
                                    onClick={() => setIsCommentModalOpen(false)}
                                >
                                    Discard
                                </Button>
                                <Button 
                                    type="submit" 
                                    form="modal-comment-form"
                                    disabled={isSubmitting}
                                    className="bg-teal-600 text-white font-bold rounded-xl"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Context"}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}