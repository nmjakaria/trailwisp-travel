import React from "react";
import StoryManagementView from "./StoryManagementView";
import { getMyStories } from "@/lib/api/stories";

export const dynamic = "force-dynamic";

export default async function UserStoriesPage() {
    let rawStories = [];

    try {
        const response = await getMyStories();
        rawStories = Array.isArray(response) ? response : response?.data || [];
    } catch (err) {
        console.error("Failed to load user journals:", err);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <StoryManagementView initialStories={rawStories} />
        </div>
    );
}