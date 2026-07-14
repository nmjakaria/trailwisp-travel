import React from "react";
import { Metadata } from "next";
import { requireRole } from "@/lib/core/session";
import { getAllBookings } from "@/lib/api/bookings";
import { getPlaces } from "@/lib/api/places";
import { getStories } from "@/lib/api/stories";
import AdminDashboardView from "@/components/dashboard/admin/AdminDashboardView";

export const metadata: Metadata = {
    title: "Overview | Admin Dashboard - Trailwisp",
    description: "Real-time metrics, booking verifications, and travel story overview.",
};

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
    // Redundant guard to ensure direct-path security
    const user = await requireRole("admin");

    let initialBookings = [];
    let initialPlaces = { data: [], total: 0 };
    let initialStories = [];

    try {
        // Fetch administration data sets in parallel on the server
        const [bookingsRes, placesRes, storiesRes] = await Promise.allSettled([
            getAllBookings(),
            getPlaces({ limit: 5 }),
            getStories(),
        ]);

        if (bookingsRes.status === "fulfilled") {
            initialBookings = bookingsRes.value || [];
        }
        if (placesRes.status === "fulfilled") {
            initialPlaces = placesRes.value || { data: [], total: 0 };
        }
        if (storiesRes.status === "fulfilled") {
            initialStories = storiesRes.value || [];
        }
    } catch (error) {
        console.error("Error building admin administration metrics:", error);
    }

    return (
        <AdminDashboardView
            user={user}
            initialBookings={initialBookings}
            placesCount={initialPlaces.total}
            initialStories={initialStories}
        />
    );
}