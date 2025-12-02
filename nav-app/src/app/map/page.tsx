import UNTLiveMap from "@/src/features/map/components/UNTLiveMapInner";
import UNTEventsWidget from "@/src/features/map/components/UNTEventsWidgets";
import UNTSearchBar from "@/components/UNTSearchBar";
import { requireAuth } from "@/src/lib/auth-utils";

export default async function MapPage() {
  await requireAuth();

  return (
    <main className="flex flex-col items-center p-4 space-y-6 w-full">
      {/* Map at the top */}
      <div className="w-full flex justify-center">
        <UNTLiveMap />
      </div>

      {/* Events widget at the bottom */}
      <div className="w-full max-w-5xl">
        <UNTEventsWidget />
      </div>
    </main>
  );
}
