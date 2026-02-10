import Link from 'next/link';
import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";
import UNTEventsWidget from "@/src/features/map/components/UNTEventsWidgets";

export default async function HomePage() {
  await requireAuth();
  
  return (
    // Added a subtle gradient background to make the glass effect visible
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 pb-12">
      
      {/* 1. Nav-APP Style Header (Apple Glass Style) */}
      <header className="sticky top-4 z-50 w-[95%] max-w-5xl mt-4 px-6 py-4 
                        bg-white/40 backdrop-blur-md backdrop-saturate-150 
                        border border-white/30 rounded-2xl shadow-lg 
                        flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#00853E]">UNT Navigator</h1>
        </div>
        
        {/* 2. Profile / Action Buttons (Glass Buttons) */}
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-800
                           bg-white/20 hover:bg-white/40 border border-white/40
                           backdrop-blur-lg transition-all active:scale-95 shadow-sm">
            Profile
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="text-center mt-12 mb-6">
        <h1 className="text-3xl font-bold text-[#00853E]">Campus Dashboard</h1>
        <p className="text-gray-600">Explore the campus map and upcoming events.</p>
      </div>

      <div className="w-full flex justify-center px-4 mb-8">
        {/* You can apply glass to the Map container too */}
        <div className="w-full p-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
           <UNTLiveMap />
        </div>
      </div>

      {/* Campus Resources - Card Update */}
      <div className="w-full max-w-5xl px-4">
        <h2 className="text-2xl font-bold text-[#00853E] mb-6">Campus Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Example of a Glass Card */}
          <div className="group bg-white/40 backdrop-blur-xl backdrop-saturate-150 
                          border border-white/40 rounded-3xl p-6 
                          hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Academic</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#00853E] hover:underline font-medium block">
                  Canvas Learning
                </Link>
              </li>
              {/* ... other links */}
            </ul>
          </div>

          {/* Repeat for other cards... */}
        </div>
      </div>
    </div>
  );
}