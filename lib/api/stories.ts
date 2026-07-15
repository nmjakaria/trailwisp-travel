//lib/api/stories.ts
"use server"
import { publicFetch, authFetch, mutate } from '../core/server';
import { revalidatePath, updateTag } from 'next/cache';   // ← revalidateTag থেকে updateTag বদলান

export async function getStories(query: { search?: string; destinationTag?: string; sort?: string } = {}) {
    const params = new URLSearchParams(query as Record<string, string>);
    try {
        return await publicFetch(`/api/stories?${params.toString()}`, { tags: ['stories'] });
    } catch (err) {
        console.error('getStories failed:', err);
        return [];
    }
}

export const getStoryById = async (id: string) =>
    publicFetch(`/api/stories/${id}`, { tags: [`story-${id}`] });

export const getMyStories = async () => authFetch('/api/stories/mine');

export const createStory = async (data: unknown) => {
    const result = await mutate('/api/stories', data, 'POST');
    revalidatePath('/dashboard/stories');
    updateTag('stories');   // ← বদলান
    return result;
};

export const updateStory = async (id: string, data: unknown) => {
    const result = await mutate(`/api/stories/${id}`, data, 'PATCH');
    revalidatePath('/dashboard/stories');
    updateTag(`story-${id}`);   // ← বদলান
    return result;
};

export const deleteStory = async (id: string) => {
    const result = await mutate(`/api/stories/${id}`, undefined, 'DELETE');
    revalidatePath('/dashboard/stories');
    return result;
};

export const toggleFeatureStory = async (id: string) => mutate(`/api/stories/${id}/feature`, undefined, 'PATCH');