import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";
import ChatBox from "@/src/features/ai/components/ChatBox";

export default async function HomePage() {
  await requireAuth();

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <UNTLiveMap />
      <ChatBox />
    </div>
  );
}