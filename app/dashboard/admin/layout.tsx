import React from "react";
import { Metadata } from "next";
import { requireRole, requireNotBlocked } from "@/lib/core/session";

export const metadata: Metadata = {
    title: "Admin Dashboard | Trailwisp",
    description: "Trailwisp administration center for managing global bookings, curation, and users.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.JSX.Element> {
    // Server-side security check. Instantly redirects if not admin or if blocked.
    await requireNotBlocked();
    await requireRole("admin");

    return (
        <div className="w-full h-full animate-[fade-in_0.3s_ease-out]">
            {children}
        </div>
    );
}