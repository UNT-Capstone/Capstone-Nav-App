"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EventItem {
  title: string;
  date: string;
  type: string;
  coords?: [number, number];
}

const EVENTS_PER_PAGE = 10;

const sampleEvents: EventItem[] = [
  { title: "Football Game", date: "Nov 30", type: "In-Person", coords: [33.2104, -97.1503] },
  { title: "Lecture: AI in Society", date: "Dec 1", type: "Online", coords: [33.2104, -97.1503] },
  { title: "Art Exhibit", date: "Dec 2", type: "In-Person", coords: [33.2120, -97.1480] },
  { title: "Workshop: Robotics", date: "Dec 3", type: "In-Person", coords: [33.2110, -97.1490] },
  // add more events...
];

const DEFAULT_TABS = ["All", "In-Person", "Online"];

const UNTEventsWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const tabs = DEFAULT_TABS;

  const filteredEvents =
    activeTab === "All" ? sampleEvents : sampleEvents.filter((e) => e.type === activeTab);

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const handleGo = (event: EventItem) => {
    const query = new URLSearchParams();
    query.set("event", event.title);
    if (event.coords) {
      query.set("lat", event.coords[0].toString());
      query.set("lng", event.coords[1].toString());
    }
    router.push(`/home?${query.toString()}`);
  };

  return (
    <div className="events-widget p-4 bg-white shadow rounded-lg">
      <div className="tabs flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="event-list grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedEvents.map((event, idx) => (
          <div key={idx} className="event-card p-3 border rounded shadow flex flex-col justify-between">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-gray-500">{event.date}</p>
            <div className="mt-2 flex justify-end">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => handleGo(event)}
              >
                Go
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination flex justify-center space-x-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UNTEventsWidget;
