import React from "react";
import Marquee from "react-fast-marquee";
import { getLatestNews } from "@/lib/api/news";
import Link from "next/link";

interface NewsItem {
    _id: string;
    title: string;
    content: string;
    badgeText?: string;
    linkUrl?: string;
}

export default async function NewsMarquee() {
    let news: NewsItem[] = [];

    try {
        const res = await getLatestNews();
        news = Array.isArray(res) ? res : res?.data || [];
    } catch (err) {
        console.error("Marquee loading failure", err);
    }

    if (news.length === 0) return null;

    return (
        <div className="w-full bg-zinc-900 text-zinc-100 border-y border-zinc-800 py-2.5 flex items-center overflow-hidden text-xs">
            {/* Left Static Indicator Box */}
            <div className="px-4 border-r border-zinc-700 flex items-center gap-2 bg-zinc-900 z-10 font-bold tracking-wider text-teal-400 shrink-0 uppercase">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Updates
            </div>

            {/* Scrolling Marquee Canvas */}
            <Marquee speed={45} pauseOnHover={true} gradient={false} className="w-full">
                {news.map((item) => {
                    const contentNode = (
                        <div className="flex items-center gap-3 mx-12 group cursor-pointer">
                            {item.badgeText && (
                                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide bg-amber-500 text-zinc-950 rounded-sm">
                                    {item.badgeText}
                                </span>
                            )}
                            <span className="font-semibold text-zinc-200 group-hover:text-teal-400 transition-colors">
                                {item.title}:
                            </span>
                            <span className="text-zinc-400">{item.content}</span>
                        </div>
                    );

                    return item.linkUrl ? (
                        <Link href={item.linkUrl} key={item._id} passHref >
                            {contentNode}
                        </Link>
                    ) : (
                        <div key={item._id}>{contentNode}</div>
                    );
                })}
            </Marquee>
        </div>
    );
}