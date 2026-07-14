"use client";

import React, { useState } from "react";
import { Link, Button } from "@heroui/react";
import { Bars, Xmark } from "@gravity-ui/icons";
import Sidebar from "@/components/dashboard/Sidebar";

interface SessionUser {
    name: string;
    email: string;
    image?: string;
    role: "user" | "admin";
    isBlocked?: boolean;
}

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    user: SessionUser;
}

export default function DashboardLayoutClient({
    children,
    user,
}: DashboardLayoutClientProps): React.JSX.Element {
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

    const closeMobileSidebar = () => setIsMobileOpen(false);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex transition-colors">
            
            {/* ─── DESKTOP PERSISTENT SIDEBAR ─── */}
            <aside className="hidden md:block w-64 lg:w-72 h-screen sticky top-0 shrink-0 z-20">
                <Sidebar user={user} />
            </aside>

            {/* ─── MOBILE SIDEBAR DRAWER OVERLAY ─── */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={closeMobileSidebar}
                    />
                    {/* Drawer container */}
                    <div className="relative w-72 max-w-xs h-full animate-[slide_0.2s_ease-out] z-50">
                        <button 
                            className="absolute top-4 right-[-3rem] flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-md focus:outline-none"
                            onClick={closeMobileSidebar}
                            aria-label="Close sidebar"
                        >
                            <Xmark size={20} />
                        </button>
                        <Sidebar user={user} onCloseMobile={closeMobileSidebar} />
                    </div>
                </div>
            )}

            {/* ─── MAIN CONTENT COLUMN ─── */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
                
                {/* Responsive Mobile Navigation bar */}
                <header className="md:hidden h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-orange-500">
                            <span className="text-sm font-bold text-white">T</span>
                        </div>
                        <span className="text-md font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
                        </span>
                    </Link>

                    <Button
                        isIconOnly
                        variant="primary"
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                        onClick={() => setIsMobileOpen(true)}
                        aria-label="Open sidebar menu"
                    >
                        <Bars size={20} />
                    </Button>
                </header>

                {/* Subpage Route Views wrapper */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
                    {children}
                </main>
            </div>

            {/* Dynamic drawer animation rule */}
            <style jsx global>{`
                @keyframes slide {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}