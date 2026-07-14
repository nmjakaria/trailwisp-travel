"use client";

import React from "react";
import { Link, Button } from "@heroui/react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
    Compass, 
    BookOpen, 
    Heart, 
    Megaphone, 
    FolderPlus, 
    Person
} from "@gravity-ui/icons";
import { CgLayoutGrid } from "react-icons/cg";
import { BiLogOut, BiMessageSquare } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import Image from "next/image";

interface SessionUser {
    name: string;
    email: string;
    image?: string;
    role: "user" | "admin";
    isBlocked?: boolean;
}

interface SidebarProps {
    user: SessionUser;
    onCloseMobile?: () => void;
}

interface SidebarLink {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar({ user, onCloseMobile }: SidebarProps): React.JSX.Element {
    const pathname = usePathname();
    const isCurrentAdmin = user.role === "admin";

    // Navigation lists mapped directly from your technical specification
    const userLinks: SidebarLink[] = [
        { name: "Overview", href: "/dashboard/user", icon: CgLayoutGrid },
        { name: "My Booked Places", href: "/dashboard/user/bookings", icon: Compass },
        { name: "Add Travel Story", href: "/dashboard/user/stories/add", icon: FolderPlus },
        { name: "My Travel Stories", href: "/dashboard/user/stories", icon: BookOpen },
        { name: "My Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
        { name: "My Profile", href: "/dashboard/user/profile", icon: Person },
    ];

    const adminLinks: SidebarLink[] = [
        { name: "Admin Stats Overview", href: "/dashboard/admin", icon: CgLayoutGrid },
        { name: "Manage Bookings", href: "/dashboard/admin/bookings", icon: Compass },
        { name: "Add New Place", href: "/dashboard/admin/places/add", icon: FolderPlus },
        { name: "Manage Places", href: "/dashboard/admin/places", icon: CgLayoutGrid },
        { name: "Manage Stories", href: "/dashboard/admin/stories", icon: BookOpen },
        { name: "Manage Comments", href: "/dashboard/admin/comments", icon: BiMessageSquare },
        { name: "Manage Users", href: "/dashboard/admin/users", icon: BsPeople },
        { name: "Add Latest News", href: "/dashboard/admin/news", icon: Megaphone },
        { name: "Admin Profile", href: "/dashboard/admin/profile", icon: Person },
    ];

    const targetNavigationLinks = isCurrentAdmin ? adminLinks : userLinks;

    const handleSignOut = async (): Promise<void> => {
        try {
            await authClient.signOut();
            window.location.href = "/";
        } catch (err) {
            console.error("Failed to sign out user", err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-colors">
            
            {/* Header / Brand Block */}
            <div className="p-6 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                {/* <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-orange-500 shadow-md">
                        <span className="text-base font-bold text-white">T</span>
                    </div>
                    <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
                    </span>
                </Link> */}
                
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md select-none ${
                    isCurrentAdmin 
                        ? "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200/50" 
                        : "bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200/50"
                }`}>
                    {user.role}
                </span>
            </div>

            {/* Navigation Options list */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
                {targetNavigationLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const IconComponent = link.icon;
                    
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={onCloseMobile}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                isActive
                                    ? "bg-teal-600 text-white shadow-sm shadow-teal-600/10"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                            }`}
                        >
                            <IconComponent className={`text-base transition-colors ${
                                isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                            }`} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User details and interactive actions footer block */}
            <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-xs mb-3">
                    <Image 
                        src={user?.image} 
                        alt={user?.name} 
                        width={40} 
                        height={40} 
                        className="rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {user?.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                            {user?.email}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={handleSignOut}
                    // variant="primary"
                    className="w-full justify-start gap-3 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-3.5 h-10 bg-transparent"
                >
                    <BiLogOut className="text-base text-red-500" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}