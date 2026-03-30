import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Cleanup function: deletes unverified users older than 3 minutes
async function cleanupUnverifiedUsers() {
  const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
  const deleted = await prisma.user.deleteMany({
    where: {
      emailVerified: false, // Boolean field in your schema
      createdAt: { lt: threeMinutesAgo },
    },
  });

  if (deleted.count > 0) {
    console.log(`Deleted ${deleted.count} unverified users`);
  }
}

// Run cleanup at server startup
cleanupUnverifiedUsers();

// Run cleanup every minute
setInterval(cleanupUnverifiedUsers, 60 * 1000);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // requires verification
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "UNT Navigator <noreply@untnavigation.me>",
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
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    deleteUnverifiedUsers: true, // keeps adapter fallback
    deleteUnverifiedUsersAfter: 60 * 3, // 3 minutes
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "UNT Navigator <noreply@untnavigation.me>",
        to: user.email,
        subject: "Welcome to UNT Navigator! Verify your email",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
            <h2 style="color: #00853E;">Welcome to UNT Navigator! 🎉</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Thanks for signing up! Please verify your email address to get started.</p>
            <p>⚠️ This link expires in <strong>3 minutes</strong>. If it expires, simply sign up again.</p>
            <a href="${url}" style="display:inline-block; margin-top:16px; padding:12px 24px;
              background:#00853E; color:white; border-radius:8px;
              text-decoration:none; font-weight:bold;">
              Verify Email
            </a>
            <p style="margin-top:24px; color:#888; font-size:13px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    },
  },
});