//lib/api/likes.ts
'use server';
import { revalidateTag } from 'next/cache';
import { mutate } from '../core/server';

export const toggleLike = async (targetId: string, targetType: 'place' | 'story') => {
    const result = await mutate('/api/likes', { targetId, targetType }, 'POST');
    revalidateTag(targetType === 'place' ? `place-${targetId}` : `story-${targetId}`);
    return result;
};