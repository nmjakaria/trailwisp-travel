import React from "react";
import { requireRole, requireNotBlocked } from "@/lib/core/session";
import { getMyBookings } from "@/lib/api/bookings";
import { getMyWishlist } from "@/lib/api/wishlist";
import { getMyStories } from "@/lib/api/stories";
import UserDashboardView from "@/components/dashboard/user/UserDashboardView";


export default async function DedicatedUserDashboardPage(): Promise<React.JSX.Element> {
    // 1. Ensure user is authenticated, has the 'user' role, and is active
    await requireNotBlocked();
    const user = await requireRole("user");

    // 2. Query personal records in parallel on the server
    let bookings = [];
    let wishlist = [];
    let stories = [];

    try {
        const [bookingsRes, wishlistRes, storiesRes] = await Promise.allSettled([
            getMyBookings(),
            getMyWishlist(),
            getMyStories(),
        ]);

        if (bookingsRes.status === "fulfilled") bookings = bookingsRes.value || [];
        if (wishlistRes.status === "fulfilled") wishlist = wishlistRes.value || [];
        if (storiesRes.status === "fulfilled") stories = storiesRes.value || [];
    } catch (error) {
        console.error("Failed to load user-specific dashboard data:", error);
    }

    // 3. Render the dynamic UI
    return (
        <UserDashboardView 
            user={user} 
            initialBookings={bookings} 
            initialWishlist={wishlist} 
            initialStories={stories} 
        />
    );
}