import Link from 'next/link';
import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";


export default async function HomePage() {
  // Ensures only logged-in users see the dashboard
  await requireAuth();
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 pb-12">
      
      {/* NOTE: The Glass Header is now provided by RootLayout. 
          The content below starts after the sticky nav. 
      */}

      {/* Hero Section */}
      <div className="text-center mt-16 mb-8 px-4">
        <h1 className="text-4xl font-extrabold text-[#00853E] tracking-tight">
          Campus Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Real-time transit, campus maps, and upcoming events.
        </p>
      </div>

      {/* Map Container - Using the same Glass style as the nav */}
      <div className="w-full max-w-6xl px-4 mb-12">
        <div className="p-2 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/40 shadow-2xl overflow-hidden">
           <div className="rounded-[2rem] overflow-hidden border border-gray-200/50">
              <UNTLiveMap />
           </div>
        </div>
      </div>

      {/* Campus Resources Grid */}
      <div className="w-full max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#00853E]">Quick Resources</h2>
          <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-[#00853E]/20 to-transparent rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resource Card 1: Academic */}
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

          {/* Resource Card 2: Transit */}
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

          {/* Resource Card 3: Student Life */}
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
      </div>
    </div>
  );
}