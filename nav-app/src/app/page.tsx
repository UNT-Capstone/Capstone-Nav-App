"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f4ec] to-[#c8e6d4] text-center">
      <motion.h1
        className="text-4xl font-bold mb-4 text-[#00853E]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Capstone Navigation App
      </motion.h1>

      <motion.p
        className="text-lg text-gray-700 mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        This is the home page. Select a route, explore the campus map, or start navigating to your destination.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/signup")}
        className="px-6 py-3 bg-[#00853E] text-white rounded-2xl shadow-md hover:bg-[#007338] transition font-semibold"
      >
        Get Started
      </motion.button>
    </div>
  );
}
