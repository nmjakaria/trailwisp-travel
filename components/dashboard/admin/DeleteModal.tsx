"use client";

import React from "react";
import { Button, Modal } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";

interface Place {
    _id: string;
    title: string;
}

interface DeleteModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPlace: Place | null;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
}

export default function DeleteModal({
    isOpen,
    onOpenChange,
    selectedPlace,
    onConfirm,
    isLoading,
}: DeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[380px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden p-6 shadow-2xl">
                        <Modal.CloseTrigger className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" />
                        
                        <Modal.Header className="flex flex-col items-center text-center space-y-3 pt-4">
                            <Modal.Icon className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 size-12 rounded-2xl flex items-center justify-center shadow-inner">
                                <TrashBin className="size-6" />
                            </Modal.Icon>
                            <Modal.Heading className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                Confirm Permanent Deletion
                            </Modal.Heading>
                        </Modal.Header>
                        
                        <Modal.Body className="text-center py-2 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                            Are you sure you want to remove <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">"{selectedPlace?.title}"</strong>? 
                            This operation completely clears this entity data from database layers and cannot be undone.
                        </Modal.Body>
                        
                        <Modal.Footer className="flex gap-3 w-full pt-4">
                            <Button 
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl h-11 border border-zinc-200 dark:border-zinc-700" 
                                onClick={() => onOpenChange(false)}
                                isDisabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl h-11 shadow-md shadow-red-600/10"
                                onClick={onConfirm}
                                isLoading={isLoading}
                            >
                                Delete Place
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}