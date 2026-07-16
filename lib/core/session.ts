//lib/core/session.ts
'use server';
import { redirect } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { unstable_noStore } from 'next/cache';

export const getUserSession = async () => {
    unstable_noStore();
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
};

export const getUserToken = async (): Promise<string | null> => {
    unstable_noStore();
    try {
        const { token } = await auth.api.getToken({ headers: await headers() });
        return token || null;
    } catch {
        return null;
    }
};

export const requireAuth = async (redirectPath: string = '/') => {
    const user = await getUserSession();
    if (!user) {
        const params = new URLSearchParams({ message: 'login_required', redirect: redirectPath });
        redirect(`/auth/signin?${params.toString()}`);
    }
    return user;
};

export const requireRole = async (role: 'user' | 'admin', redirectPath: string = '/') => {
    const user = await requireAuth(redirectPath);
    if (user.role !== role) redirect('/unauthorized');
    return user;
};

export const requireNotBlocked = async (redirectPath: string = '/') => {
    const user = await requireAuth(redirectPath);
    if (user.isBlocked) redirect('/blocked');
    return user;
};