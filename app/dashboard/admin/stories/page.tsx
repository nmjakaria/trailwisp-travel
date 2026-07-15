import React from "react";
import AdminStoryManagementView from "./AdminStoryManagementView";
import { getStories } from "@/lib/api/stories";

export const metadata = {
    title: "Admin Stories Management",
    description: "Administrative dashboard for managing all travel stories.",
}
export const dynamic = "force-dynamic";

export default async function AdminStoriesPage() {
    let rawStories = [];

    try {
        // Fetch all stories globally
        const response = await getStories();
        rawStories = Array.isArray(response) ? response : response?.data || [];
    } catch (err) {
        console.error("Failed to fetch administrative feeds:", err);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <AdminStoryManagementView initialStories={rawStories} />
        </div>
    );
}