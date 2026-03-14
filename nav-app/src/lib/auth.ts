import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      sendResetPassword: async ({ user, url }) => {
        await resend.emails.send({
          from: "UNT Navigator <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your password",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
              <h2 style="color: #00853E;">Reset Your Password</h2>
              <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
              <a href="${url}" style="display:inline-block; margin-top:16px; padding:12px 24px;
                background:#00853E; color:white; border-radius:8px;
                text-decoration:none; font-weight:bold;">
                Reset Password
              </a>
              <p style="margin-top:24px; color:#888; font-size:13px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      },
    }
});