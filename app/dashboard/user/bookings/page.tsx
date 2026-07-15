import React from "react";
import { requireRole, requireNotBlocked } from "@/lib/core/session";
import { getMyBookings } from "@/lib/api/bookings";
import BookingsManagerView from "./BookingsManagerView";


export default async function UserBookingsPage(): Promise<React.JSX.Element> {
    await requireNotBlocked();
    const user = await requireRole("user");

    let initialBookings = [];
    try {
        initialBookings = await getMyBookings() || [];
    } catch (error) {
        console.error("Failed to load user bookings:", error);
    }

    return <BookingsManagerView initialBookings={initialBookings} />;
}

