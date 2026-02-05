// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  trustProxy: true,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  trustedOrigins: [
    "https://unt-nav-app.vercel.app",                   
    "http://localhost:3000",                            
    "https://mapumang-capstone-nav-app.vercel.app"      
  ],
});
