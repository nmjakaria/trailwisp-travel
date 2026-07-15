"use client";

import { useState } from "react";
import { Card, Button, toast } from "@heroui/react";
import { Heart, TrashBin, ArrowRight, Star } from "@gravity-ui/icons";
import { removeFromWishlist } from "@/lib/api/wishlist";
import Link from "next/link";

export default function WishlistManagerView({ initialWishlist }: { initialWishlist: any[] }) {
    const [wishlist, setWishlist] = useState<any[]>(initialWishlist);
    const [isMutating, setIsMutating] = useState<string | null>(null);

    const handleRemoveWishlist = async (wishlistId: string) => {
        setIsMutating(wishlistId);
        try {
            await removeFromWishlist(wishlistId);
            setWishlist((prev) => prev.filter((w) => w._id !== wishlistId));
            toast.success("Removed from your wishlist");
        } catch (err: any) {
            toast.warning(err.message || "Failed to remove item");
        } finally {
            setIsMutating(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Heart className="text-rose-500" /> My Wishlist
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Your collection of saved adventure spots and ideal properties.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                    <p className="text-sm text-zinc-500">Your wishlist is currently empty.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                        <Card 
                            key={item._id} 
                            className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl flex flex-row items-center justify-between gap-4 shadow-xs"
                        >
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                    {item.placeId?.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-zinc-500 truncate max-w-[180px]">
                                        {item.placeId?.location}
                                    </span>
                                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs shrink-0">
                                        <Star size={10} className="fill-current" />
                                        {item.placeId?.rating ?? "4.5"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    as={Link}
                                    href={`/destinations/${item.placeId?._id}`}
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="rounded-lg text-teal-600"
                                >
                                    <ArrowRight size={16} />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="outline"
                                    color="danger"
                                    onClick={() => handleRemoveWishlist(item._id)}
                                    isLoading={isMutating === item._id}
                                    className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <TrashBin size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}