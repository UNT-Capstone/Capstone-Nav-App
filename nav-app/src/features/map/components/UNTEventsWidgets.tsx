"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface EventItem {
  title: string;
  date: string;
  type: string;
  coords?: [number, number];
}

const sampleEvents: EventItem[] = [
  { title: "Football Game", date: "Nov 30", type: "In-Person", coords: [33.2104, -97.1503] },
  { title: "Lecture: AI in Society", date: "Dec 1", type: "Online", coords: [33.2104, -97.1503] },
  { title: "Art Exhibit", date: "Dec 2", type: "In-Person", coords: [33.2120, -97.1480] },
];

const UNTEventsWidgetContent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [highlightedEvent, setHighlightedEvent] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const eventTitle = searchParams.get("event");
    if (eventTitle) setHighlightedEvent(eventTitle);
  }, [searchParams]);

  const filteredEvents = activeTab === "All" ? sampleEvents : sampleEvents.filter(e => e.type === activeTab);

  return (
    <div className="p-4 bg-white shadow-xl rounded-2xl border-t-4 border-[#00853E]">
      <div className="flex gap-2 mb-4">
        {["All", "In-Person", "Online"].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setHighlightedEvent(null); }}
            className={`px-4 py-1 rounded-full text-xs font-bold ${activeTab === tab ? "bg-[#00853E] text-white" : "bg-gray-100 text-gray-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredEvents.map((event, i) => (
          <div key={i} className={`p-4 border rounded-xl transition-all ${highlightedEvent === event.title ? "border-[#00853E] bg-green-50 scale-[1.02]" : "border-gray-100"}`}>
            <h3 className="font-bold text-gray-900">{event.title}</h3>
            <p className="text-xs text-gray-500">{event.date}</p>
            <button 
              onClick={() => router.push(`/home?lat=${event.coords?.[0]}&lng=${event.coords?.[1]}`)}
              className="mt-3 w-full py-2 bg-gray-100 text-gray-800 rounded-lg text-[10px] font-black uppercase hover:bg-gray-200"
            >
              Locate on Map
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Next.js requires Suspense when using useSearchParams
const UNTEventsWidget = () => (
  <Suspense fallback={<div>Loading Widget...</div>}>
    <UNTEventsWidgetContent />
  </Suspense>
);

export default UNTEventsWidget;