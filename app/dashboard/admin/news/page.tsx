import React from "react";
import NewsManagerView from "./NewsManagerView";
import { getAllNews } from "@/lib/api/news";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
    let news = [];
    try {
        const response = await getAllNews(1, 50);
        news = Array.isArray(response) ? response : response?.data || [];
    } catch (error) {
        console.error("Failed to fetch dashboard news items:", error);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <NewsManagerView initialNews={news} />
        </div>
    );
}