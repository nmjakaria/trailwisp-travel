import React from "react";
import { requireRole, requireNotBlocked } from "@/lib/core/session";
import { getMyWishlist } from "@/lib/api/wishlist";
import WishlistManagerView from "./WishlistManagerView";

export default async function UserWishlistPage(): Promise<React.JSX.Element> {
    await requireNotBlocked();
    const user = await requireRole("user");

    let initialWishlist = [];
    try {
        initialWishlist = await getMyWishlist() || [];
    } catch (error) {
        console.error("Failed to load user wishlist:", error);
    }

    return <WishlistManagerView initialWishlist={initialWishlist} />;
}
