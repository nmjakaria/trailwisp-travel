//lib/api/comments.ts
'use server';
import { revalidateTag } from 'next/cache';
import { publicFetch, mutate, authFetch } from '../core/server';

export interface CreateCommentInput {
    targetId: string;
    targetType: 'place' | 'story';
    text: string;
}
export const getAllComments = async (page = 1, limit = 20) =>
    authFetch(`/api/comments/all?page=${page}&limit=${limit}`);

export const getCommentsForTarget = async (targetId: string) =>
    publicFetch(`/api/comments/${targetId}`, { tags: [`comments-${targetId}`] });


export const getBestComments = async () =>
    publicFetch('/api/comments/best', { tags: ['best-comments'] });

export const createComment = async (data: CreateCommentInput) => {
    const result = await mutate('/api/comments', data, 'POST');
    revalidateTag(`comments-${data.targetId}`);
    return result;
};

export const deleteComment = async (id: string, targetId: string) => {
    const result = await mutate(`/api/comments/${id}`, undefined, 'DELETE');
    revalidateTag(`comments-${targetId}`);
    return result;
};

// --- Admin ---
export const toggleBestComment = async (id: string, targetId: string) => {
    const result = await mutate(`/api/comments/${id}/feature`, undefined, 'PATCH');
    revalidateTag(`comments-${targetId}`);
    revalidateTag('best-comments');
    return result;
};