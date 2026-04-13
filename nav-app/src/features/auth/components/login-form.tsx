"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

// defining the shape of the form 
const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [forgotError, setForgotError] = useState("");

  // Resend verification state
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent">("idle");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/home",
      }, {
        onSuccess: () => {
          router.push("/home");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        }
      }
    )
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus("loading");
    setForgotError("");

    try {
      await authClient.requestPasswordReset({
        email: forgotEmail,
        redirectTo: "/reset-password",
      });
      setForgotStatus("sent");
    } catch (err: any) {
      setForgotError(err?.message || "Something went wrong. Please try again.");
      setForgotStatus("error");
    }
  };

  const handleResendVerification = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Enter your email above first");
      return;
    }
    setResendStatus("loading");
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/home",
      });
      setResendStatus("sent");
      toast.success("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error("Failed to resend. Please try again.");
      setResendStatus("idle");
    }
  };

  const closeForgotModal = () => {
    setShowForgot(false);
    setForgotEmail("");
    setForgotStatus("idle");
    setForgotError("");
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-[#e6f4ec] to-[#c8e6d4] p-6">
      <motion.div 
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-3 text-[#00853E]">Welcome Back!</h1>
        <p className="text-3l mb-6">Login to continue</p>
        <Form {...form}>
          <form className="flex flex-col gap-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) =>(
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) =>(
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        placeholder="************"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                    {/* Forgot password link */}
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-xs text-[#00853E] hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <button
              type="submit"
              className="bg-[#00853E] text-white px-4 py-2 rounded hover:bg-[#007338] transition font-semibold"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>
          </form>
        </Form>

        {/* Resend verification email */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resendStatus === "loading" || resendStatus === "sent"}
            className="text-xs text-gray-400 hover:text-[#00853E] hover:underline disabled:opacity-50"
          >
            {resendStatus === "sent"
              ? "✅ Verification email sent!"
              : resendStatus === "loading"
              ? "Sending..."
              : "Didn't get verification email? Resend"}
          </button>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-[#00853E] hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgotModal}
            />

            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
                onClick={(e) => e.stopPropagation()}
              >
                {forgotStatus === "sent" ? (
                  <div className="space-y-3">
                    <div className="text-4xl">📬</div>
                    <h2 className="text-lg font-bold text-gray-800">Check your email</h2>
                    <p className="text-gray-500 text-sm">
                      If an account exists for <strong>{forgotEmail}</strong>, we sent
                      a reset link. It expires in 1 hour.
                    </p>
                    <button
                      onClick={closeForgotModal}
                      className="mt-4 text-sm text-[#00853E] hover:underline font-medium"
                    >
                      Back to login
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-[#00853E] mb-1">Reset Password</h2>
                    <p className="text-gray-500 text-sm mb-5">
                      Enter your email and we'll send you a reset link.
                    </p>
                    <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D] text-sm"
                      />

                      {forgotStatus === "error" && (
                        <p className="text-red-500 text-xs">{forgotError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={forgotStatus === "loading"}
                        className="bg-[#00853E] text-white px-4 py-2 rounded hover:bg-[#007338] transition font-semibold text-sm disabled:opacity-60"
                      >
                        {forgotStatus === "loading" ? "Sending..." : "Send Reset Link"}
                      </button>

                      <button
                        type="button"
                        onClick={closeForgotModal}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
