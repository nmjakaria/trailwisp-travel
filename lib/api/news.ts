//lib/api/news.ts
'use server';
import { revalidateTag } from 'next/cache';
import { publicFetch, mutate } from '../core/server';

export interface CreateNewsInput {
    title: string;
    body: string;
}

/** Navbar-এর scrolling news ticker-এর জন্য — পাবলিক */
export const getNews = () =>
    publicFetch('/api/news', { revalidate: 30, tags: ['news'] }); // ticker ঘন ঘন আপডেট হতে পারে, তাই cache কম সময়ের

// --- Admin ---
export const createNews = async (data: CreateNewsInput) => {
    const result = await mutate('/api/news', data, 'POST');
    revalidateTag('news');
    return result;
};