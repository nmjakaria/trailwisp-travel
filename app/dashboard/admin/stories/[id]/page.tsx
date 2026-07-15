import React from "react";
import AdminEditStoryView from "./AdminEditStoryView";
import { getStoryById } from "@/lib/api/stories";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminEditStoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let story = null;

    try {
        const response = await getStoryById(id);
        story = response?.data || response;
    } catch (err) {
        console.error("Failed to read story record via Admin override sequence", err);
    }

    if (!story || !story._id) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <AdminEditStoryView story={story} />
        </div>
    );
}