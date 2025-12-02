import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMapInner";
import UNTEventsWidget from "@/src/features/map/components/UNTEventsWidgets";

export default async function HomePage() {
  await requireAuth();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#00853E]">Welcome to UNT Navigator</h1>
      <p className="mb-4">Select a route or explore the campus map.</p>
      {/* Map at the top */}
      <div className="w-full flex justify-center">
        <UNTLiveMap />
      </div>

      {/* Events widget at the bottom */}
      <div className="w-full max-w-5xl">
        <UNTEventsWidget />
      </div>
    </div>
  );
}
