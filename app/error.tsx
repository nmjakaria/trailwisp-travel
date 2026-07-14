/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect } from "react";
import { Button, Link, Card } from "@heroui/react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {

    useEffect(() => {
        // Log the error to your error reporting service (Sentry, LogRocket, etc.)
        console.error("Application Error Boundaried:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-zinc-950 px-4 transition-colors">

            {/* Brand Header */}
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

            {/* Error Content Card */}
            <Card className="w-full max-w-lg p-8 md:p-10 text-center shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors rounded-[2rem]">

                {/* Visual Error Header */}
                <div className="relative flex justify-center mb-6">
                    <span className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-orange-500/20 to-teal-600/10 dark:from-orange-500/30 dark:to-teal-600/10 select-none">
                        500
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-orange-500 dark:text-orange-400 bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-150 dark:border-zinc-800 shadow-xs">
                            Path Blocked
                        </span>
                    </div>
                </div>

                {/* Travel-themed Error Copy */}
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
                    A Landslide on the Trail
                </h1>

                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-sm mx-auto">
                    We hit an unexpected obstacle while loading this view. The terrain maps might be temporarily out of sync.
                </p>

                {/* Optional: Error ID / Digest for admin debugging */}
                {error.digest && (
                    <div className="mb-8 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left font-mono text-[10px] text-zinc-400 select-all overflow-x-auto">
                        <span className="font-semibold text-zinc-500 dark:text-zinc-300">SYSTEM DIGEST:</span> {error.digest}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                    {/* Next.js reset standard capability */}
                    <Button
                        type="button"
                        onPress={() => reset()}
                        className="w-full sm:w-auto font-semibold rounded-xl text-sm h-12 px-6 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/10"
                    >
                        Try Again
                    </Button>

                    <Link
                        href="/"
                    >
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto font-semibold rounded-xl text-sm h-12 px-6 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                            Return Home
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Travel Quote/Sub-Footer */}
            <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-600 text-center tracking-wide uppercase">
                "An obstacle is simply a detour to an unmapped view."
            </p>
        </div>
    );
}