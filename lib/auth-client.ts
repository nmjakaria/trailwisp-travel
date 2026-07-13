// app/lib/auth-client.ts
"use client";

import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// The inferred type mapping will strictly enforce types for custom fields (like role, plan, isBlocked) across your application pages.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL,
  plugins: [
    jwtClient(),
  ],
});

// Correctly destructuring from the typed authClient instance
export const { signIn, signUp, signOut, useSession } = authClient;