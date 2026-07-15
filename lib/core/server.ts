//lib/core/server.ts

import { getUserToken } from './session';
// import { getUserToken } from './session';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    auth?: boolean;
    revalidate?: number | false;
    tags?: string[];
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = false, revalidate, tags } = options;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = await getUserToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        // GET request হলে ও auth লাগবে না হলে cache/revalidate ব্যবহার করা যায়
        // Auth-required বা mutation হলে সবসময় fresh ডেটা লাগবে
        ...(auth || method !== 'GET'
            ? { cache: 'no-store' as const }
            : { next: { revalidate: revalidate ?? (auth ? 0 : 60), tags } }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new ApiError(errorData.message || `HTTP Error ${res.status}`, res.status);
    }

    if (res.status === 204) return null as T;
    return res.json();
}

/** পাবলিক GET — Homepage, Destinations listing, Story listing ইত্যাদির জন্য (ISR cache করা যায়) */
export const publicFetch = <T>(path: string, options?: Pick<RequestOptions, 'revalidate' | 'tags'>) =>
    request<T>(path, { method: 'GET', auth: false, ...options });

/** লগইন-প্রয়োজনীয় GET — "My Bookings", "My Wishlist" ইত্যাদির জন্য */

export const authFetch = <T>(path: string, options?: Pick<RequestOptions, 'tags'>) =>
    request<T>(path, { method: 'GET', auth: true, ...options });

/** যেকোনো মিউটেশন (POST/PUT/PATCH/DELETE) — সবসময় auth token পাঠানোর চেষ্টা করে */
export const mutate = <T>(path: string, body?: unknown, method: RequestOptions['method'] = 'POST') =>
    request<T>(path, { method, body, auth: true });