import { requireAuth } from "@/src/lib/auth-utils";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaLocationArrow } from 'react-icons/fa';
import Link from "next/link";

const MOCK_SCHEDULE = [
  {
    id: 1,
    course: "CSCE 4901: Capstone I",
    time: "09:30 AM - 10:50 AM",
    location: "Discovery Park B Building",
    days: "Tue, Thu",
  },
  {
    id: 2,
    course: "CSCE 3600: Systems Programming",
    time: "12:30 PM - 01:50 PM",
    location: "BLB – Business Leadership Building",
    days: "Mon, Wed",
  },
  {
    id: 3,
    course: "CSCE 4110: Algorithms",
    time: "02:00 PM - 03:20 PM",
    location: "General Academic Building (GAB)",
    days: "Mon, Wed",
  }
];

export default async function CalendarPage() {
  await requireAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full px-8 py-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Schedule</h1>
            <p className="text-sm font-bold text-[#00853E] uppercase tracking-widest mt-1">Spring 2026 • UNT Denton</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hidden sm:block">
            <FaCalendarAlt size={24} className="text-gray-300" />
          </div>
        </header>

        <div className="space-y-6">
          {MOCK_SCHEDULE.map((item) => (
            <div key={item.id} className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-[#00853E]/30 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-green-50 text-[#00853E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{item.days}</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <FaClock size={12} />
                    <span className="text-xs font-bold">{item.time}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{item.course}</h3>
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                  <FaMapMarkerAlt size={14} className="text-gray-300" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* THE "GO TO CLASS" BUTTON */}
              <Link 
                href={`/home?navTo=${encodeURIComponent(item.location)}`}
                className="h-12 px-8 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 justify-center hover:bg-[#00853E] transition-all shadow-lg active:scale-95"
              >
                <FaLocationArrow size={12} />
                Go to Class
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}