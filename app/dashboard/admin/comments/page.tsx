import React from "react";
import CommentsManagerView from "./CommentsManagerView";
import { getAllComments } from "@/lib/api/comments";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
    let comments = [];
    
    try {
        // Fetch the first 50 comments for the administration view
        const response = await getAllComments(1, 50);
        
        // Handle cases where your API returns an envelope like { data: [...] } or the array directly
        comments = Array.isArray(response) ? response : response?.data || [];
    } catch (error) {
        console.error("Failed to load admin comments:", error);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <CommentsManagerView initialComments={comments} />
        </div>
    );
}