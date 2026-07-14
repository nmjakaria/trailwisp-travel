//lib/api/wishlist.ts
'use server';
import { revalidatePath } from 'next/cache';
import { authFetch, mutate } from '../core/server';

export const getMyWishlist = async () => authFetch('/api/wishlist/mine');

export const addToWishlist = async (placeId: string) => {
    const result = await mutate('/api/wishlist', { placeId }, 'POST');
    revalidatePath('/dashboard/wishlist');
    return result;
};

export const removeFromWishlist = async (id: string) => {
    const result = await mutate(`/api/wishlist/${id}`, undefined, 'DELETE');
    revalidatePath('/dashboard/wishlist');
    return result;
};