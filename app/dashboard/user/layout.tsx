import React from "react";
import { requireRole } from "@/lib/core/session";
export const metadata = {
    title: "Trailwisp | User Dashboard",
    description: "Your personal dashboard for managing your trailwisp experience."
};
export default async function UserSubpageLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.JSX.Element> {
    // Verify user role on the server for all nested user resources
    await requireRole("user");

    return (
        <div className="w-full h-full animate-[fade-in_0.3s_ease-out]">
            {children}
        </div>
    );
}