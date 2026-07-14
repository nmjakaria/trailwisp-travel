//lib/api/stories.ts
import { publicFetch, authFetch, mutate } from '../core/server';
import { revalidatePath, revalidateTag } from 'next/cache';

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

export const getMyStories = () => authFetch('/api/stories/mine'); // যদি এই এন্ডপয়েন্ট backend-এ যোগ করেন

export const createStory = async (data: unknown) => {
    const result = await mutate('/api/stories', data, 'POST');
    revalidatePath('/dashboard/stories');
    revalidateTag('stories');
    return result;
};

export const updateStory = async (id: string, data: unknown) => {
    const result = await mutate(`/api/stories/${id}`, data, 'PUT');
    revalidatePath('/dashboard/stories');
    revalidateTag(`story-${id}`);
    return result;
};

export const deleteStory = async (id: string) => {
    const result = await mutate(`/api/stories/${id}`, undefined, 'DELETE');
    revalidatePath('/dashboard/stories');
    return result;
};