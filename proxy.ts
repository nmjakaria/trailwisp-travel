/* eslint-disable @typescript-eslint/no-explicit-any */
import dns from "node:dns";
// Explicitly overriding Node's internal DNS resolver to use Google's servers before network calls.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from "@/lib/auth"; // Ensure your Better Auth instance is imported correctly here

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        // 1. Get the exact internal URL the user is trying to navigate to
        const currentUrl = request.nextUrl.pathname + request.nextUrl.search;

        // 2. Instantiate a dynamic routing target URL matching the application base origin
        const loginUrl = new URL('/auth/signin', request.url);

        // 3. Set structural query constraints to catch redirect states in the signup/signin forms
        loginUrl.searchParams.set('redirect', currentUrl);
        loginUrl.searchParams.set('message', 'login_required');

        // 4. Force interception and redirect the request pool safely
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Next.js explicitly tracks this exact exported config identifier to map background proxy hooks
export const config = {
    matcher: ['/dashboard/:path*'],
};