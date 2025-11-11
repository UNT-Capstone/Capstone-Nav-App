"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f4ec] to-[#c8e6d4] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#00853E]">Login</h1>

        <form className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00A85D]"
            required
          />
          <button
            type="submit"
            className="bg-[#00853E] text-white px-4 py-2 rounded hover:bg-[#007338] transition font-semibold"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-[#00853E] hover:underline font-medium"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}
