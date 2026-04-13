import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient({
  baseURL: "https://capstone-bice-psi.vercel.app"
});
