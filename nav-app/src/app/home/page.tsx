import Link from 'next/link';
import { requireAuth } from "@/src/lib/auth-utils";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";
import UNTEventsWidget from "@/src/features/map/components/UNTEventsWidgets";

export default async function HomePage() {
  await requireAuth();
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="text-center mt-8 mb-6">
        <h1 className="text-3xl font-bold text-[#00853E]">Welcome to UNT Navigator</h1>
        <p className="text-gray-600">Select a route or explore the campus map.</p>
      </div>

      {/* Map at the top */}
      <div className="w-full flex justify-center px-4 mb-8">
        <UNTLiveMap />
      </div>

      {/* Events widget */}
      <div className="w-full max-w-5xl px-4 mb-8">
        <UNTEventsWidget />
      </div>

      {/* Campus Resources Section */}
      <div className="w-full max-w-5xl px-4">
        <h2 className="text-2xl font-bold text-[#00853E] mb-4">Campus Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Academic */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Academic</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://unt.instructure.com/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Canvas Learning Management
                </Link>
              </li>
              <li>
                <Link href="https://library.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  University Libraries
                </Link>
              </li>
              <li>
                <Link href="https://registrar.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Registrar & Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 2: Transport & Dining */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Life on Campus</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://transportation.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Bus Routes & Parking
                </Link>
              </li>
              <li>
                <Link href="https://dining.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Dining Menus & Hours
                </Link>
              </li>
              <li>
                <Link href="https://recsports.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Recreational Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 3: Support */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Student Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://studentaffairs.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Dean of Students
                </Link>
              </li>
              <li>
                <Link href="https://studenthealth.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  Student Health & Wellness
                </Link>
              </li>
              <li>
                <Link href="https://techtour.unt.edu/" target="_blank" className="text-[#00853E] hover:underline hover:text-[#006931] transition-colors font-medium block">
                  UIT Help Desk
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
