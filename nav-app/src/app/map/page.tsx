import UNTLiveMap from "@/components/UNTLiveMap";
import UntEventsWidget from "@/components/UNTEventsWidgets";
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
        <UntEventsWidget />
      </div>
    </main>
  );
}
