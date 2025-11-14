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
const signinSchema = z.object({
  name: z.string().min(1, "Name cannot empty"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SignupForm() {
  const router = useRouter();
  
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SigninFormValues) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/home")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        }
      }
    );
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
        <h1 className="text-3xl font-bold mb-3 text-[#00853E]">
          Don't have an account?
        </h1>
        <p className="text-3l mb-6">Create an account to get started!</p>

        <Form {...form}>
          <form className="flex flex-col gap-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) =>(
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) =>(
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
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
                    <FormLabel>password</FormLabel>
                    <FormControl>
                    <input
                      type="password"
                      placeholder="************"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
                      {...field}
                    />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="confirmPassword"
                render={({ field }) =>(
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                    <input
                      type="password"
                      placeholder="************"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
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
              Sign up
            </button>
          </form>
        </Form>

        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#00853E] hover:underline font-medium"
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
