"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";

// --- INTERFACES ---
interface UNTFriend {
  id: string;
  name: string;
  image?: string;
}

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
  createdBy?: string; 
  taggedFriends?: UNTFriend[];
  filters: {
    event_types?: { name: string }[];
  };
  geo?: {
    latitude: string;
    longitude: string;
  };
}

interface CommentNodeProps {
  comment: UNTComment;
  allComments: UNTComment[];
  level: number;
  onReply: (comment: UNTComment) => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({ comment, allComments, level, onReply }) => {
  const children = allComments.filter(c => c.parentId === comment.id);
  const indentClass = level > 0 ? "ml-6 md:ml-10" : "";

  return (
    <div className={`space-y-3 ${indentClass}`}>
      <div className={`p-4 rounded-2xl border transition-all ${level === 0 ? "bg-gray-50 border-gray-100" : "bg-white border-l-4 border-[#00853E] shadow-sm"}`}>
        <p className="text-[#00853E] font-black text-[9px] uppercase mb-1">
          {comment.user} <span className="text-gray-300 font-normal ml-2">{comment.timestamp}</span>
        </p>
        <p className="text-gray-700 text-sm leading-snug">{comment.text}</p>
        <button 
          onClick={() => onReply(comment)}
          className="mt-2 text-[9px] font-black uppercase text-gray-400 hover:text-[#00853E]"
        >
          ↩ Reply
        </button>
      </div>
      
      {children.length > 0 && (
        <div className="space-y-3">
          {children.map(child => (
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

// --- MAIN COMPONENT ---
interface UNTEventsPageProps {
  initialUserName: string;
}

const UNTEventsPage: React.FC<UNTEventsPageProps> = ({ initialUserName }) => {
  const router = useRouter();
  const trpc = useTRPC();
  
  // --- STATE ---
  const [view, setView] = useState<"official" | "user" | "my-events">("official");
  const [events, setEvents] = useState<UNTEvent[]>([]);
  const [userEvents, setUserEvents] = useState<UNTEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({ name: initialUserName || "Mean Green Eagle" });

  // --- EDITING STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState<number | null>(null);

  // --- FRIEND TAGGING STATE ---
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<UNTFriend[]>([]);

  const { data: friends = [] } = useQuery(
    trpc.getFriends.queryOptions(undefined, {
      enabled: true,
    })
  );

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    date: "", 
    time: "", 
    location: "", 
    description: "",
    lat: "33.2108",
    lng: "-97.1459"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showForum, setShowForum] = useState(false);
  const [comments, setComments] = useState<Record<number, UNTComment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<UNTComment | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedComments = localStorage.getItem("unt_event_discussions");
    const savedUserEvents = localStorage.getItem("unt_user_events");
    const savedDraft = localStorage.getItem("unt_event_draft");
    const pickedCoord = localStorage.getItem("unt_last_picked_coord");

    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedUserEvents) setUserEvents(JSON.parse(savedUserEvents));
    
    if (pickedCoord) {
      const { lat, lng } = JSON.parse(pickedCoord);
      const draft = savedDraft ? JSON.parse(savedDraft) : formData;
      setFormData({ ...draft, lat, lng });
      setShowForm(true);
      setView("user");
      localStorage.removeItem("unt_last_picked_coord");
      localStorage.removeItem("unt_event_draft");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("unt_event_discussions", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem("unt_user_events", JSON.stringify(userEvents));
  }, [userEvents]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://calendar.unt.edu/api/2/events?days=30&pp=50");
        const data = await response.json();
        const eventList: UNTEvent[] = data.events.map((item: any) => ({ ...item.event, isOfficial: true }));
        const uniqueEvents = Array.from(new Map(eventList.map((e: any) => [e.id, e])).values());
        setEvents(uniqueEvents as UNTEvent[]);
        if (uniqueEvents.length > 0) setActiveEventId((uniqueEvents[0] as UNTEvent).id);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- HANDLERS ---
  const handleGoToMap = (event: UNTEvent) => {
    const lat = event.geo?.latitude || "33.2108";
    const lng = event.geo?.longitude || "-97.1459";
    router.push(`/home?event=${encodeURIComponent(event.title)}&lat=${lat}&lng=${lng}`);
  };

  const handlePickOnMap = () => {
    localStorage.setItem("unt_event_draft", JSON.stringify(formData));
    localStorage.setItem("unt_picking_mode", "true");
    router.push("/home");
  };

  const openEditModal = (event: UNTEvent) => {
    setIsEditing(true);
    setEditEventId(event.id);
    const [date, timeWithSeconds] = event.first_date.split('T');
    setFormData({
      title: event.title,
      date: date,
      time: timeWithSeconds.substring(0, 5),
      location: event.location_name,
      description: event.description_text,
      lat: event.geo?.latitude || "33.2108",
      lng: event.geo?.longitude || "-97.1459"
    });
    setSelectedFriends(event.taggedFriends || []);
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editEventId) {
      setUserEvents(prev => prev.map(ev => ev.id === editEventId ? {
        ...ev,
        title: formData.title,
        first_date: `${formData.date}T${formData.time}:00`,
        location_name: formData.location,
        description_text: formData.description,
        taggedFriends: selectedFriends,
        geo: { latitude: formData.lat, longitude: formData.lng }
      } : ev));
    } else {
      const newEvent: UNTEvent = {
        id: Date.now(),
        title: formData.title,
        first_date: `${formData.date}T${formData.time}:00`,
        location_name: formData.location,
        description_text: formData.description,
        createdBy: currentUser.name,
        taggedFriends: selectedFriends,
        isOfficial: false,
        filters: { event_types: [{ name: "Student Post" }] },
        geo: { latitude: formData.lat, longitude: formData.lng }
      };
      setUserEvents([newEvent, ...userEvents]);
      setActiveEventId(newEvent.id);
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditEventId(null);
    setSelectedFriends([]);
    setFormData({ title: "", date: "", time: "", location: "", description: "", lat: "33.2108", lng: "-97.1459" });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeEventId) return;

    const comment: UNTComment = {
      id: Date.now(),
      parentId: replyingTo?.id,
      user: currentUser.name,
      text: newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setComments(prev => ({ ...prev, [activeEventId]: [...(prev[activeEventId] || []), comment] }));
    setNewComment("");
    setReplyingTo(null);
  };

  // --- FILTERED DATA LOGIC ---
  const myInvolvedEvents = useMemo(() => {
    const allEvents = [...events, ...userEvents];
    return allEvents.filter(ev => 
      ev.createdBy === currentUser.name || 
      ev.taggedFriends?.some(f => f.name === currentUser.name)
    );
  }, [events, userEvents, currentUser.name]);

  const currentEventList = useMemo(() => {
    if (view === "official") return events;
    if (view === "user") return userEvents;
    return myInvolvedEvents;
  }, [view, events, userEvents, myInvolvedEvents]);

  const filteredEvents = useMemo(() => {
    return currentEventList.filter((event) => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentEventList, searchQuery]);

  const activeEvent = currentEventList.find((e) => e.id === activeEventId) || (filteredEvents.length > 0 ? filteredEvents[0] : null);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
        <p className="text-[#00853E] font-black uppercase tracking-widest text-sm animate-pulse">🦅 Fetching UNT Data...</p>
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-12 px-4 md:px-8 bg-gray-50 text-gray-900 font-sans relative z-0 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
            <button onClick={() => { setView("official"); setActiveEventId(null); }} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === "official" ? "bg-[#00853E] text-white shadow-lg" : "text-gray-500 hover:text-[#00853E]"}`}>UNT Events</button>
            <button onClick={() => { setView("user"); setActiveEventId(null); }} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === "user" ? "bg-[#00853E] text-white shadow-lg" : "text-gray-500 hover:text-[#00853E]"}`}>Community</button>
            <button onClick={() => { setView("my-events"); setActiveEventId(null); }} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === "my-events" ? "bg-[#00853E] text-white shadow-lg" : "text-gray-500 hover:text-[#00853E]"}`}>My Events</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder="Search events..." className="pl-4 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none w-full md:w-64 bg-white shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {view === "user" && <button onClick={() => setShowForm(true)} className="bg-[#00853E] text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#006a31] transition-all">+ Create Post</button>}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden md:h-[calc(100vh-340px)] border border-gray-100">
          <div className="md:col-span-4 border-r overflow-y-auto bg-[#fafafa]">
            {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        {view === "my-events" ? "Nothing scheduled yet" : "No results found"}
                    </p>
                    {view === "my-events" && <p className="text-[9px] text-gray-400 mt-2">Tag friends or create your own events to see them here.</p>}
                </div>
            ) : filteredEvents.map((event) => (
              <button key={event.id} onClick={() => { setActiveEventId(event.id); setShowForum(false); setReplyingTo(null); }} className={`w-full text-left p-6 border-b transition-all relative ${activeEventId === event.id ? "bg-white border-l-[10px] border-l-[#00853E] shadow-inner" : "opacity-60 hover:opacity-100"}`}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-[#00853E] uppercase">{new Date(event.first_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p>
                  {event.isOfficial && <span className="bg-green-100 text-[#00853E] text-[8px] px-1.5 py-0.5 rounded font-black tracking-tighter">✓ OFFICIAL</span>}
                </div>
                <h3 className="font-bold leading-tight text-gray-800 line-clamp-2">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-2 truncate italic">📍 {event.location_name}</p>
              </button>
            ))}
          </div>

          <div className="md:col-span-8 p-6 md:p-12 overflow-y-auto bg-white flex flex-col relative">
            {activeEvent ? (
              <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-6 flex flex-wrap gap-2 items-center">
                  {activeEvent.isOfficial ? (
                    <span className="bg-[#00853E] text-white text-[9px] px-3 py-1.5 rounded-full font-black tracking-widest">🦅 VERIFIED OFFICIAL UNT EVENT</span>
                  ) : (
                    <>
                      <span className="bg-gray-100 text-gray-600 text-[9px] px-3 py-1.5 rounded-full font-black tracking-widest">👤 POSTED BY: {activeEvent.createdBy}</span>
                      {activeEvent.taggedFriends?.map(friend => (
                        <span key={friend.id} className="bg-green-50 text-[#00853E] text-[9px] px-3 py-1.5 rounded-full font-black tracking-widest border border-green-100">🤝 WITH {friend.name.toUpperCase()}</span>
                      ))}
                      {activeEvent.createdBy === currentUser.name && (
                        <button onClick={() => openEditModal(activeEvent)} className="ml-auto text-[9px] font-black text-gray-400 hover:text-[#00853E] uppercase tracking-widest underline underline-offset-4 decoration-2">
                          Edit Post
                        </button>
                      )}
                    </>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-8 text-gray-900 tracking-tighter leading-tight">{activeEvent.title}</h2>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-10 flex items-center gap-6">
                    <div className="text-center border-r pr-6 border-gray-200">
                        <p className="text-xs font-black text-[#00853E] uppercase">{new Date(activeEvent.first_date).toLocaleDateString(undefined, {month: 'short'})}</p>
                        <p className="text-2xl font-black text-gray-900">{new Date(activeEvent.first_date).toLocaleDateString(undefined, {day: 'numeric'})}</p>
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-800 uppercase">Location</p>
                        <p className="text-sm text-gray-500">{activeEvent.location_name || "UNT Campus"}</p>
                    </div>
                </div>
                <div className="prose prose-lg text-gray-600 flex-grow leading-relaxed mb-10">
                    {activeEvent.description_text ? activeEvent.description_text.replace(/<[^>]*>?/gm, "") : "Join fellow Mean Green students for this event!"}
                </div>
                <div className="flex flex-wrap gap-4 pt-10 border-t mt-auto">
                  <button onClick={() => setShowForum(true)} className="px-8 py-5 bg-white text-gray-900 border-2 border-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-md">
                    💬 Discussion ({(comments[activeEventId!] || []).length})
                  </button>
                  <button onClick={() => handleGoToMap(activeEvent)} className="px-8 py-5 bg-[#00853E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex-grow text-center hover:bg-[#006a31] shadow-lg transition-all">
                    🗺️ Route on Map
                  </button>
                </div>

                {showForum && (
                  <div className="absolute inset-0 bg-white z-20 p-8 flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b">
                      <h3 className="text-2xl font-black uppercase text-[#00853E]">Deep Conversation</h3>
                      <button onClick={() => { setShowForum(false); setReplyingTo(null); }} className="font-black text-gray-400 uppercase text-xs hover:text-black">✕ Close</button>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-6 mb-6 pr-2">
                      {(comments[activeEventId!] || []).length === 0 ? (
                        <p className="text-gray-400 italic text-center py-20">No messages yet. Start the buzz!</p>
                      ) : (
                        comments[activeEventId!].filter(c => !c.parentId).map(root => (
                          <CommentNode key={root.id} comment={root} allComments={comments[activeEventId!]} level={0} onReply={setReplyingTo} />
                        ))
                      )}
                    </div>
                    <form onSubmit={handlePostComment} className="flex flex-col gap-2">
                        {replyingTo && (
                          <div className="flex justify-between items-center bg-green-50 px-4 py-2 rounded-t-xl border-t border-x border-green-100">
                            <p className="text-[10px] text-[#00853E] font-bold italic">Replying to {replyingTo.user}...</p>
                            <button type="button" onClick={() => setReplyingTo(null)} className="text-[10px] font-black text-gray-400">✕ CANCEL</button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={replyingTo ? "Write your nested reply..." : "Type a message..."} className={`flex-grow bg-gray-100 p-5 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-[#00853E] ${replyingTo ? 'rounded-tl-none border-l-2 border-[#00853E]' : ''}`} />
                          <button type="submit" className="bg-[#00853E] text-white px-8 rounded-2xl font-black uppercase text-[10px]">Send</button>
                        </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 italic"><p>Select an event to view full details</p></div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start md:items-center justify-center p-2 md:p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 w-full max-w-sm md:max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-3xl font-black text-[#00853E] uppercase mb-4 md:mb-8 tracking-tighter">
              {isEditing ? "Edit Post" : "New Community Post"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-3 md:space-y-4">
              <input required placeholder="Event Name" className="w-full p-3 md:p-4 bg-gray-100 rounded-xl md:rounded-2xl outline-none text-sm font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <input required type="date" className="p-3 md:p-4 bg-gray-100 rounded-xl md:rounded-2xl outline-none text-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                <input required type="time" className="p-3 md:p-4 bg-gray-100 rounded-xl md:rounded-2xl outline-none text-sm" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Tag Friends</label>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-1">
                  {selectedFriends.map(friend => (
                    <span key={friend.id} className="bg-[#00853E]/10 text-[#00853E] px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black flex items-center gap-1 md:gap-2">
                      {friend.name.toUpperCase()}
                      <button type="button" onClick={() => setSelectedFriends(prev => prev.filter(f => f.id !== friend.id))} className="hover:text-red-500 font-bold text-[10px]">✕</button>
                    </span>
                  ))}
                </div>
                <button type="button" onClick={() => setShowFriendPicker(!showFriendPicker)} className="w-full p-3 md:p-4 bg-gray-100 rounded-xl md:rounded-2xl text-left text-xs text-gray-500 flex justify-between items-center border border-transparent hover:border-gray-200 transition-all">
                  {showFriendPicker ? "Close Friend List" : "Add Friends to this event..."}
                  <span className="text-[8px]">{showFriendPicker ? "▲" : "▼"}</span>
                </button>
                {showFriendPicker && (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-xl max-h-40 overflow-y-auto p-2 grid grid-cols-1 gap-1 animate-in slide-in-from-top-2">
                    {friends.length > 0 ? friends.map(friend => (
                      <button key={friend.id} type="button" onClick={() => { if (!selectedFriends.find(f => f.id === friend.id)) setSelectedFriends([...selectedFriends, friend as UNTFriend]); }} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all text-left">
                        <div className="w-7 h-7 bg-[#00853E] rounded-full flex items-center justify-center text-white text-[10px] font-black">
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{friend.name}</span>
                      </button>
                    )) : <p className="text-center py-4 text-[10px] text-gray-400 uppercase font-black">No friends found</p>}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input required placeholder="Location Name" className="w-full p-3 md:p-4 bg-gray-100 rounded-xl md:rounded-2xl outline-none text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <button type="button" onClick={handlePickOnMap} className="w-full py-2.5 md:py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00853E] transition-all flex items-center justify-center gap-2">
                  📍 {formData.lat !== "33.2108" ? "Location Set (Change)" : "Pinpoint Precise Spot on Map"}
                </button>
              </div>
              <textarea required placeholder="Description" rows={3} className="w-full p-3 md:p-4 bg-gray-100 rounded-xl md:rounded-2xl outline-none text-sm resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="flex gap-3 md:gap-4 pt-3 md:pt-4">
                <button type="button" onClick={closeForm} className="flex-grow py-3 md:py-5 bg-gray-200 rounded-xl md:rounded-2xl font-black uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-grow py-3 md:py-5 bg-[#00853E] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px]">
                  {isEditing ? "Save Changes" : "Post to Feed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default UNTEventsPage;
