import { requireAuth } from "@/src/lib/auth-utils";

export default async function HomePage() {
  await requireAuth();
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold text-[#00853E]">Welcome to UNT Navigator</h1>
      <p className="mb-4">Select a route or explore the campus map.</p>
      {/* Placeholder for map component */}
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        Campus Map Placeholder
      </div>
    </div>
  );
}
