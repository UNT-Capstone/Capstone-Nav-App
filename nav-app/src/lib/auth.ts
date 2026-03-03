import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    
    baseURL: process.env.BETTER_AUTH_URL || `https://${process.env.VERCEL_URL}`,
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    }
});