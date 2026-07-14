import React from "react";
import { requireAuth } from "@/lib/core/session";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.JSX.Element> {
    // 1. Server-side session guard (auto-redirects to /login if unauthenticated)
    const user = await requireAuth();

    // 2. Render the interactive shell, passing down the real authenticated user
    return (
        <DashboardLayoutClient user={user}>
            {children}
        </DashboardLayoutClient>
    );
}