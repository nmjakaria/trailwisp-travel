//lib/api/places.ts

import { mutate, publicFetch } from "../core/server";

export interface PlaceQuery {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    location?: string;
    sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
    featured?: boolean;
    page?: number;
    limit?: number;
}

function buildQuery(query: Record<string, unknown>) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) params.append(key, String(value));
    });
    return params.toString();
}

export async function getPlaces(query: PlaceQuery = {}) {
    try {
        return await publicFetch(`/api/places?${buildQuery(query)}`, { tags: ['places'] });
    } catch (err) {
        console.error('getPlaces failed:', err);
        return { data: [], total: 0, page: 1, totalPages: 1 };
    }
}

export const getPlaceById = async (id: string) =>
    publicFetch(`/api/places/${id}`, { tags: [`place-${id}`] });

export const getFeaturedPlaces = async () =>
    publicFetch(`/api/places?featured=true`, { tags: ['places'] });

export const createPlace = (data: unknown) => mutate('/api/places', data, 'POST');
export const updatePlace = (id: string, data: unknown) => mutate(`/api/places/${id}`, data, 'PATCH');
export const deletePlace = (id: string) => mutate(`/api/places/${id}`, undefined, 'DELETE');
export const toggleFeaturePlace = (id: string) => mutate(`/api/places/${id}/feature`, undefined, 'PATCH');