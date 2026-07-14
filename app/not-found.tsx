"use client";

import React from "react";
import { Button, Link, Card } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function NotFound(): React.JSX.Element {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-zinc-950 px-4 transition-colors">
            {/* Global Brand Logo Container */}
            <div className="mb-8">
                <Link href="/" className="flex flex-col items-center gap-2 group">
                    {/* Logo Visual Icon - Trailwisp Deep Teal to Sunset Orange */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-orange-500 shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <span className="text-2xl font-bold text-white">T</span>
                    </div>
                    {/* Brand Name Text */}
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
                    </span>
                </Link>
            </div>

            {/* Interactive 404 Card */}
            <Card className="w-full max-w-lg p-8 md:p-10 text-center shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors rounded-[2rem]">
                {/* 404 Visual Header */}
                <div className="relative flex justify-center mb-6">
                    <span className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-teal-600/20 to-orange-500/10 dark:from-teal-600/30 dark:to-orange-500/10 select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-teal-600 dark:text-teal-400 bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-150 dark:border-zinc-800 shadow-xs">
                            Path Lost
                        </span>
                    </div>
                </div>

                {/* Travel-themed Not Found Copy */}
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
                    Off the Beaten Track
                </h1>
                <p className="text-sm md:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed mb-8 max-w-sm mx-auto">
                    It looks like this trail has grown over. The page you are looking for doesn't exist, has been moved, or is temporarily offline.
                </p>

                {/* Interactive Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                    <Button
                        type="button"
                        onPress={() => router.back()}
                        variant="bordered"
                        className="w-full sm:w-auto font-semibold rounded-xl text-sm h-12 px-6 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                        Go Back
                    </Button>

                    <Button
                        as={Link}
                        href="/destinations"
                        className="w-full sm:w-auto font-semibold rounded-xl text-sm h-12 px-6 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/10"
                    >
                        Explore Destinations
                    </Button>
                </div>
            </Card>

            {/* Travel Quote/Sub-Footer Footer */}
            <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-600 text-center tracking-wide uppercase">
                "Not all those who wander are lost... but you might be."
            </p>
        </div>
    );
}