"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#e6f4ec] to-[#c8e6d4] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-3 max-w-sm w-full">
          <p className="text-red-500 font-semibold">Invalid or missing reset link.</p>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-[#00853E] hover:underline"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");

    try {
      await authClient.resetPassword({
        newPassword: password,
        token,
      });
      setStatus("success");
      toast.success("Password updated! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. The link may have expired.");
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-[#e6f4ec] to-[#c8e6d4] p-6">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-[#00853E]">New Password</h1>
        <p className="text-gray-500 text-sm mb-6">Choose a strong password for your account.</p>

        {status === "success" ? (
          <div className="space-y-3">
            <div className="text-5xl">✅</div>
            <h2 className="text-lg font-semibold text-gray-800">Password updated!</h2>
            <p className="text-gray-500 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D] text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirm password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D] text-sm"
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[#00853E] text-white px-4 py-2 rounded hover:bg-[#007338] transition font-semibold disabled:opacity-60"
            >
              {status === "loading" ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-gray-400 hover:text-gray-600 text-center"
            >
              ← Back to login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}