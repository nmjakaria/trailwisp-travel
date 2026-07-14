import React from "react";
import { Metadata } from "next";
import { requireRole, requireNotBlocked } from "@/lib/core/session";
import AddPlaceForm from "@/components/dashboard/admin/AddPlaceForm";


export const metadata: Metadata = {
    title: "Add New Destination | Admin Dashboard",
    description: "Expand the Trailwisp map by registering a new verified travel destination.",
};

export default async function AddPlacePage(): Promise<React.JSX.Element> {
    // Server-side security checks
    await requireNotBlocked();
    await requireRole("admin");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Add New <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">Destination</span>
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Enter details matching the verified system specifications below to publish a new booking-ready location.
                </p>
            </div>

            <AddPlaceForm />
        </div>
    );
}