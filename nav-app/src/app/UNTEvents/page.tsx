"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// --- INTERFACES ---
interface UNTComment {
  id: number;
  parentId?: number;
  user: string;
  text: string;
  timestamp: string;
}

interface UNTEvent {
  id: number;
  title: string;
  description_text: string;
  location_name: string;
  localist_url?: string;
  first_date: string;
  isOfficial?: boolean;
  filters: {
    event_types?: { name: string }[];
  };
  geo?: {
    latitude: string;
    longitude: string;
  };
}

// --- SUB-COMPONENT: RECURSIVE COMMENT NODE ---
interface CommentNodeProps {
  comment: UNTComment;
  allComments: UNTComment[];
  level: number;
  onReply: (comment: UNTComment) => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({ comment, allComments, level, onReply }) => {
  const children = allComments.filter((c) => c.parentId === comment.id);
  const indentClass = level > 0 ? "ml-4 md:ml-6" : "";

  return (
    <div className={`space-y-2 ${indentClass}`}>
      <div
        className={`p-3 rounded-xl border transition-all ${
          level === 0
            ? "bg-gray-50 border-gray-100"
            : "bg-white border-l-4 border-[#00853E] shadow-sm"
        }`}
      >
        <p className="text-[#00853E] font-black text-[9px] uppercase mb-1">
          {comment.user}{" "}
          <span className="text-gray-300 font-normal ml-2">{comment.timestamp}</span>
        </p>
        <p className="text-gray-700 text-sm leading-snug">{comment.text}</p>
        <button
          onClick={() => onReply(comment)}
          className="mt-1.5 text-[9px] font-black uppercase text-gray-400 hover:text-[#00853E]"
        >
          ↩ Reply
        </button>
      </div>

      {children.length > 0 && (
        <div className="space-y-2">
          {children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              allComments={allComments}
              level={level + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE ---
const UNTEventsPage: React.FC = () => {
  const [view, setView] = useState<"official" | "user">("official");
  const [events, setEvents] = useState<UNTEvent[]>([]);
  const [userEvents, setUserEvents] = useState<UNTEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showForum, setShowForum] = useState(false);
  const [comments, setComments] = useState<Record<number, UNTComment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<UNTComment | null>(null);

  const router = useRouter();

  // Persistence
  useEffect(() => {
    const savedComments = localStorage.getItem("unt_event_discussions");
    const savedUserEvents = localStorage.getItem("unt_user_events");
    if (savedComments) {
      try { setComments(JSON.parse(savedComments)); } catch (e) { console.error(e); }
    }
    if (savedUserEvents) {
      try { setUserEvents(JSON.parse(savedUserEvents)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("unt_event_discussions", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem("unt_user_events", JSON.stringify(userEvents));
  }, [userEvents]);

  // API Fetch
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://calendar.unt.edu/api/2/events?days=30&pp=50"
        );
        const data = await response.json();
        const eventList: UNTEvent[] = data.events.map((item: any) => ({
          ...item.event,
          isOfficial: true,
        }));
        const uniqueEvents = Array.from(
          new Map(eventList.map((e) => [e.id, e])).values()
        );
        setEvents(uniqueEvents);
        if (uniqueEvents.length > 0) setActiveEventId(uniqueEvents[0].id);
        setLoading(false);
      } catch (err) {
        setError("Could not load events.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleGoToMap = async (event: UNTEvent) => {
    const lat = event.geo?.latitude || "33.2108";
    const lng = event.geo?.longitude || "-97.1459";
    router.push(
      `/home?event=${encodeURIComponent(event.title)}&lat=${lat}&lng=${lng}`
    );
  };

  const handleCreateUserEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: UNTEvent = {
      id: Date.now(),
      title: formData.title,
      first_date: `${formData.date}T${formData.time}:00`,
      location_name: formData.location,
      description_text: formData.description,
      isOfficial: false,
      filters: { event_types: [{ name: "Student Post" }] },
    };
    setUserEvents([newEvent, ...userEvents]);
    setShowForm(false);
    setActiveEventId(newEvent.id);
    setFormData({ title: "", date: "", time: "", location: "", description: "" });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeEventId) return;

    const comment: UNTComment = {
      id: Date.now(),
      parentId: replyingTo?.id,
      user: "Mean Green Student",
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
    setReplyingTo(null);
  };

  const currentEventList = view === "official" ? events : userEvents;
  const filteredEvents = useMemo(() => {
    return currentEventList.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentEventList, searchQuery]);

  const activeEvent =
    currentEventList.find((e) => e.id === activeEventId) ||
    (filteredEvents.length > 0 ? filteredEvents[0] : null);

  if (loading)
    return (
      // 7rem = navbar height
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 7rem)" }}>
        <p className="text-[#00853E] font-black uppercase tracking-widest text-sm animate-pulse">
          🦅 Fetching UNT Data...
        </p>
      </div>
    );

  return (
    /*
      HEIGHT STRATEGY — works at every zoom level:
      ─────────────────────────────────────────────
      layout.tsx gives <main> pt-28 (= 7rem = navbar height).
      So this component starts exactly below the navbar.
      We set height: calc(100vh - 7rem) to fill the rest of the screen.
      Inside, flex-col + flex-1 + min-h-0 lets the panel grow to fill
      whatever remains after the fixed-height header row — no magic numbers.
      vh is zoom-invariant: at 200% zoom, 100vh is still the visible screen.
    */
    <div
      className="flex flex-col bg-gray-50 text-gray-900 font-sans"
      style={{ height: "calc(100vh - 7rem)" }}
    >
      <div className="flex flex-col h-full max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4">

        {/* PAGE HEADER — fixed height, doesn't grow */}
        <header className="flex-shrink-0 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-gray-200/50 p-1 rounded-xl w-fit">
            <button
              onClick={() => { setView("official"); setActiveEventId(null); }}
              className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all ${
                view === "official"
                  ? "bg-[#00853E] text-white shadow"
                  : "text-gray-500 hover:text-[#00853E]"
              }`}
            >
              UNT Events
            </button>
            <button
              onClick={() => { setView("user"); setActiveEventId(null); }}
              className={`px-4 py-2 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all ${
                view === "user"
                  ? "bg-[#00853E] text-white shadow"
                  : "text-gray-500 hover:text-[#00853E]"
              }`}
            >
              User Events
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search events..."
              className="pl-3 pr-3 py-2 rounded-xl border border-gray-200 text-sm outline-none w-full sm:w-52 bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {view === "user" && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#00853E] text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#006a31] transition-all whitespace-nowrap"
              >
                + Create
              </button>
            )}
          </div>
        </header>

        {/* MAIN PANEL — flex-1 + min-h-0 = fills all remaining space, no calc needed */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          {/* SIDEBAR */}
          <div className="md:col-span-4 border-r overflow-y-auto bg-[#fafafa]">
            {filteredEvents.length === 0 && (
              <p className="text-gray-400 italic text-sm text-center py-12 px-4">
                No events found.
              </p>
            )}
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setActiveEventId(event.id);
                  setShowForum(false);
                  setReplyingTo(null);
                }}
                className={`w-full text-left p-4 border-b transition-all relative ${
                  activeEventId === event.id
                    ? "bg-white border-l-[6px] border-l-[#00853E] shadow-inner"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-[9px] font-black text-[#00853E] uppercase">
                    {new Date(event.first_date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  {event.isOfficial && (
                    <span className="bg-green-100 text-[#00853E] text-[7px] px-1.5 py-0.5 rounded font-black tracking-tighter">
                      ✓ OFFICIAL
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm leading-tight text-gray-800 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 truncate italic">
                  📍 {event.location_name}
                </p>
              </button>
            ))}
          </div>

          {/* DETAIL VIEW */}
          <div className="md:col-span-8 overflow-hidden bg-white flex flex-col relative">
            {activeEvent ? (
              <div className="flex flex-col h-full p-5 sm:p-8 animate-in fade-in slide-in-from-bottom-4">

                {/* Badge */}
                <div className="mb-3 flex-shrink-0">
                  {activeEvent.isOfficial ? (
                    <span className="bg-[#00853E] text-white text-[8px] px-2.5 py-1 rounded-full font-black tracking-widest">
                      🦅 VERIFIED OFFICIAL UNT EVENT
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-[8px] px-2.5 py-1 rounded-full font-black tracking-widest">
                      👤 STUDENT COMMUNITY POST
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 text-gray-900 tracking-tighter leading-tight flex-shrink-0">
                  {activeEvent.title}
                </h2>

                {/* Date/Location */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4 flex items-center gap-4 flex-shrink-0">
                  <div className="text-center border-r pr-4 border-gray-200 shrink-0">
                    <p className="text-[9px] font-black text-[#00853E] uppercase">
                      {new Date(activeEvent.first_date).toLocaleDateString(undefined, { month: "short" })}
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {new Date(activeEvent.first_date).toLocaleDateString(undefined, { day: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-800 uppercase">Location</p>
                    <p className="text-sm text-gray-500">
                      {activeEvent.location_name || "UNT Campus"}
                    </p>
                  </div>
                </div>

                {/* Description — only this section scrolls */}
                <div className="flex-1 min-h-0 overflow-y-auto text-sm text-gray-600 leading-relaxed mb-4 pr-1">
                  {activeEvent.description_text
                    ? activeEvent.description_text.replace(/<[^>]*>?/gm, "")
                    : "Join fellow Mean Green students for this event!"}
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap gap-2 pt-4 border-t flex-shrink-0">
                  <button
                    onClick={() => setShowForum(true)}
                    className="px-4 py-2.5 bg-white text-gray-900 border-2 border-gray-900 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                  >
                    💬 Discussion ({(comments[activeEventId!] || []).length})
                  </button>

                  {activeEvent.localist_url && (
                    <a
                      href={activeEvent.localist_url}
                      target="_blank"
                      className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-gray-200 transition-all border border-gray-200"
                    >
                      Official Page
                    </a>
                  )}

                  <button
                    onClick={() => handleGoToMap(activeEvent)}
                    className="px-4 py-2.5 bg-[#00853E] text-white rounded-xl font-black uppercase text-[9px] tracking-widest flex-grow text-center hover:bg-[#006a31] shadow transition-all"
                  >
                    🗺️ Route on Map
                  </button>
                </div>

                {/* FORUM OVERLAY */}
                {showForum && (
                  <div className="absolute inset-0 bg-white z-20 p-5 sm:p-8 flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b flex-shrink-0">
                      <h3 className="text-lg font-black uppercase text-[#00853E]">Discussion</h3>
                      <button
                        onClick={() => { setShowForum(false); setReplyingTo(null); }}
                        className="font-black text-gray-400 uppercase text-xs hover:text-black"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto space-y-4 mb-4 pr-1">
                      {(comments[activeEventId!] || []).length === 0 ? (
                        <p className="text-gray-400 italic text-center py-16 text-sm">
                          No messages yet. Start the buzz!
                        </p>
                      ) : (
                        comments[activeEventId!]
                          .filter((c) => !c.parentId)
                          .map((root) => (
                            <CommentNode
                              key={root.id}
                              comment={root}
                              allComments={comments[activeEventId!]}
                              level={0}
                              onReply={setReplyingTo}
                            />
                          ))
                      )}
                    </div>

                    <form onSubmit={handlePostComment} className="flex flex-col gap-2 flex-shrink-0">
                      {replyingTo && (
                        <div className="flex justify-between items-center bg-green-50 px-3 py-1.5 rounded-t-xl border-t border-x border-green-100">
                          <p className="text-[9px] text-[#00853E] font-bold italic">
                            Replying to {replyingTo.user}...
                          </p>
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="text-[9px] font-black text-gray-400"
                          >
                            ✕ CANCEL
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={replyingTo ? "Write your reply..." : "Type a message..."}
                          className={`flex-grow bg-gray-100 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#00853E] ${
                            replyingTo ? "rounded-tl-none border-l-2 border-[#00853E]" : ""
                          }`}
                        />
                        <button
                          type="submit"
                          className="bg-[#00853E] text-white px-5 rounded-xl font-black uppercase text-[9px]"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 italic text-sm">
                <p>Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-[#00853E] uppercase mb-5 tracking-tighter">
              New Community Post
            </h3>
            <form onSubmit={handleCreateUserEvent} className="space-y-3">
              <input
                required
                placeholder="Event Name"
                className="w-full p-3 bg-gray-100 rounded-xl outline-none text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="date"
                  className="p-3 bg-gray-100 rounded-xl outline-none text-sm"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <input
                  required
                  type="time"
                  className="p-3 bg-gray-100 rounded-xl outline-none text-sm"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <input
                required
                placeholder="Location"
                className="w-full p-3 bg-gray-100 rounded-xl outline-none text-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <textarea
                required
                placeholder="Description"
                rows={3}
                className="w-full p-3 bg-gray-100 rounded-xl outline-none text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-grow py-3 bg-gray-200 rounded-xl font-black uppercase text-[9px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 bg-[#00853E] text-white rounded-xl font-black uppercase text-[9px]"
                >
                  Post to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UNTEventsPage;