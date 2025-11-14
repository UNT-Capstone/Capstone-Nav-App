import UNTLiveMap from "@/components/UNTLiveMap";
import { requireAuth } from "@/src/lib/auth-utils";

export default async function MapPage() {
  await requireAuth();

  return (
    <main className="flex justify-center items-center p-4">
      <UNTLiveMap />
    </main>
  );
}
