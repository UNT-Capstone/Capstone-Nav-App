import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";
import ChatBoxWrapper from "@/src/features/ai/components/ChatBoxWrapper";

export default async function HomePage() {
  await requireAuth();

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <UNTLiveMap />
      <ChatBoxWrapper />
    </div>
  );
}