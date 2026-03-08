"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UNTComment {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

interface UNTEvent {
  id: number;
  title: string;
  description_text: string;
  location_name: string;
  localist_url: string;
  first_date: string;
  geo?: {
    latitude: string;
    longitude: string;
  };
}

const UNTEventsPage: React.FC = () => {
  const [events, setEvents] = useState<UNTEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForum, setShowForum] = useState(false);
  const [comments, setComments] = useState<Record<number, UNTComment[]>>({});
  const [newComment, setNewComment] = useState("");

  const router = useRouter();

  // Load saved comments
  useEffect(() => {
    const savedComments = localStorage.getItem("unt_event_discussions");
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error("Failed to parse saved comments", e);
      }
    }
  }, []);

  // Save comments
  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      localStorage.setItem(
        "unt_event_discussions",
        JSON.stringify(comments)
      );
    }
  }, [comments]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://calendar.unt.edu/api/2/events?days=30&pp=20"
        );

        if (!response.ok) throw new Error("Failed to reach UNT Calendar");

        const data = await response.json();

        const eventList: UNTEvent[] = data.events.map(
          (item: any) => item.event
        );

        // 🔧 FIX: Remove duplicate events
        const uniqueEvents = Array.from(
          new Map(eventList.map((e) => [e.id, e])).values()
        );

        setEvents(uniqueEvents);

        if (uniqueEvents.length > 0) {
          setActiveEventId(uniqueEvents[0].id);
        }

        setLoading(false);
      } catch (err) {
        setError(
          "Could not load events. Please check your connection."
        );
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const activeEvent = events.find((e) => e.id === activeEventId);

  const handleGoToMap = async (event: UNTEvent) => {
    const query = new URLSearchParams();
    query.set("event", event.title);

    let lat = event.geo?.latitude;
    let lng = event.geo?.longitude;

    if (!lat || !lng) {
      try {
        const searchName = event.location_name || "UNT Denton";

        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchName + " UNT Denton"
          )}`
        );

        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
          lat = geoData[0].lat;
          lng = geoData[0].lon;
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }

    query.set("lat", lat || "33.2108");
    query.set("lng", lng || "-97.1459");

    router.push(`/home?${query.toString()}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !activeEventId) return;

    const comment: UNTComment = {
      id: Date.now(),
      user: "Student User",
      text: newComment,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setComments((prev) => ({
      ...prev,
      [activeEventId]: [...(prev[activeEventId] || []), comment],
    }));

    setNewComment("");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-[#00853E] border-gray-200 rounded-full animate-spin mb-4"></div>
        <p className="text-[#00853E] font-black uppercase tracking-widest text-xs">
          Fetching Live Data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        {error}
      </div>
    );

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 text-gray-900 font-sans relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#00853E] uppercase tracking-tighter">
              UNT Events
            </h1>
            <div className="h-1.5 w-12 bg-[#00853E] mt-1"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden h-[700px] border border-gray-100">
          {/* Sidebar */}
          <div className="md:col-span-4 border-r overflow-y-auto bg-[#fafafa]">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setActiveEventId(event.id);
                  setShowForum(false);
                }}
                className={`w-full text-left p-6 border-b transition-all ${
                  activeEventId === event.id
                    ? "bg-white border-l-8 border-l-[#00853E] shadow-md"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <p className="text-[10px] font-black text-[#00853E] uppercase mb-1">
                  {new Date(event.first_date).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" }
                  )}
                </p>

                <h3 className="font-bold leading-tight text-gray-800 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-xs text-gray-500 mt-2 truncate">
                  📍 {event.location_name || "Check Official Page"}
                </p>
              </button>
            ))}
          </div>

          {/* Detail View */}
          <div className="md:col-span-8 p-10 overflow-y-auto bg-white flex flex-col relative">
            {activeEvent && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                <h2 className="text-4xl font-black mb-6 leading-tight text-gray-900">
                  {activeEvent.title}
                </h2>

                <div className="flex flex-col gap-3 mb-10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <p className="font-bold text-gray-700">
                      {activeEvent.location_name ||
                        "Location via Map"}
                    </p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none flex-grow">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {activeEvent.description_text
                      ? activeEvent.description_text
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 800)
                      : "No details provided."}
                  </p>
                </div>

                {/* Forum */}
                {showForum && (
                  <div className="absolute inset-0 bg-white z-20 p-10 flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black uppercase text-[#00853E]">
                        Discussion
                      </h3>
                      <button
                        onClick={() => setShowForum(false)}
                        className="text-gray-400 hover:text-black font-bold"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2">
                      {(comments[activeEventId!] || []).length ===
                      0 ? (
                        <p className="text-gray-400 italic">
                          No comments yet. Be the first to start
                          the conversation!
                        </p>
                      ) : (
                        comments[activeEventId!].map((c) => (
                          <div
                            key={c.id}
                            className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-sm text-[#00853E]">
                                {c.user}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {c.timestamp}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {c.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <form
                      onSubmit={handleAddComment}
                      className="flex gap-2"
                    >
                      <input
                        value={newComment}
                        onChange={(e) =>
                          setNewComment(e.target.value)
                        }
                        placeholder="Ask a question or share info..."
                        className="flex-grow bg-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#00853E] text-sm"
                      />

                      <button
                        type="submit"
                        className="bg-[#00853E] text-white px-6 rounded-xl font-bold text-xs uppercase"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 pt-8 border-t mt-8">
                  <a
                    href={activeEvent.localist_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all border border-gray-200"
                  >
                    Details
                  </a>

                  <button
                    onClick={() => setShowForum(true)}
                    className="px-6 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                  >
                    💬 Discussion (
                    {(comments[activeEventId!] || []).length})
                  </button>

                  <button
                    onClick={() => handleGoToMap(activeEvent)}
                    className="px-6 py-4 bg-[#00853E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#006a31] transition-all flex-grow text-center"
                  >
                    View & Route on Map
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UNTEventsPage;