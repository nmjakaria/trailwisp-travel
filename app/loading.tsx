"use client";

import React from "react";
import { Card } from "@heroui/react";

export default function Loading(): React.JSX.Element {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-zinc-950 px-4 transition-colors">
            
            {/* Centered Brand Loading Block */}
            <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
                
                {/* Brand Identity Wrapper */}
                <div className="flex flex-col items-center gap-2 group animate-pulse">
                    {/* Animated Pulsing Logo Visual Icon (Deep Teal to Sunset Orange) */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-orange-500 shadow-lg relative">
                        <span className="text-2xl font-bold text-white">T</span>
                        
                        {/* Orbiting Loading Ring */}
                        <div className="absolute -inset-1.5 rounded-[1.25rem] border-2 border-dashed border-teal-600/60 dark:border-teal-400/40 animate-spin [animation-duration:8s]" />
                    </div>
                    {/* Brand Name Text */}
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
                        Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
                    </span>
                </div>

                {/* Skeleton Card mimicking content blocks */}
                <Card className="w-full p-6 shadow-sm border border-zinc-200/65 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors rounded-[1.5rem] flex flex-col gap-4">
                    
                    {/* Simulated Text Skeleton Lines */}
                    <div className="space-y-2.5">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/3 mx-auto animate-pulse" />
                        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-5/6 mx-auto animate-pulse" />
                    </div>

                    {/* Infinite Loading Slider Line (Brand Accentuated) */}
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden relative">
                        <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-full w-1/3 rounded-full absolute left-0 top-0 animate-[loading_1.5s_infinite_ease-in-out]" />
                    </div>

                    {/* Micro-Copy */}
                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse">
                        Mapping your route...
                    </span>
                </Card>
                
            </div>

            {/* Custom Keyframes Injected for CSS Progress Bar Animation */}
            <style jsx global>{`
                @keyframes loading {
                    0% {
                        left: -35%;
                        width: 35%;
                    }
                    50% {
                        width: 45%;
                    }
                    100% {
                        left: 100%;
                        width: 35%;
                    }
                }
            `}</style>
        </div>
    );
}