import { createAuthClient } from "better-auth/client";

const BASE_URL =
  typeof window === "undefined"
    ? undefined
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const authClient = createAuthClient({
  baseURL: BASE_URL,
});