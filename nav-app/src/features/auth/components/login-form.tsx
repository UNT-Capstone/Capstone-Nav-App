"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "sonner";


// defining the shape of the form 
const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

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
                  </FormItem>
                )}
              />
            </div>
            <button
              type="submit"
              className="bg-[#00853E] text-white px-4 py-2 rounded hover:bg-[#007338] transition font-semibold"
              disabled={isPending}
            >
              Log in
            </button>
          </form>
        </Form>

        <p className="mt-6 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-[#00853E] hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
