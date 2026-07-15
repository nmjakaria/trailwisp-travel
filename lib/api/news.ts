'use server';
import { revalidateTag } from 'next/cache';
import { publicFetch, mutate, authFetch } from '../core/server';

export interface NewsInput {
    title: string;
    content: string;
    badgeText?: string;
    linkUrl?: string;
}

export const getLatestNews = async () =>
    publicFetch('/api/news/latest', { tags: ['latest-news'] });

export const getAllNews = async (page = 1, limit = 20) =>
    authFetch(`/api/news/all?page=${page}&limit=${limit}`);

export const createNews = async (data: NewsInput) => {
    const result = await mutate('/api/news', data, 'POST');

    return result;
};

export const deleteNews = async (id: string) => {
    const result = await mutate(`/api/news/${id}`, undefined, 'DELETE');

    return result;
};