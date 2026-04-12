import Link from "next/link";
import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";
import ChatBox from "@/src/features/ai/components/ChatBox";

export default async function HomePage() {
  await requireAuth();

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <UNTLiveMap />

      {/* AI ChatBox floating bottom-right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBox />
      </div>

      {/* Campus Resources Grid (commented out) */}
      {/* <div className="w-full max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#00853E]">Quick Resources</h2>
          <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-[#00853E]/20 to-transparent rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Academic</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  Canvas Learning
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  MyUNT Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="group bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Transit</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  Bus Schedules
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  Parking Maps
                </Link>
              </li>
            </ul>
          </div>

          <div className="group bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Student Life</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  Dining Menus
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  Rec Center Hours
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
}