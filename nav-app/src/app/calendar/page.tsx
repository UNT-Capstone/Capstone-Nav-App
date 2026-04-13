"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Calendar, MapPin, Clock, Trash2, Navigation } from "lucide-react";
import { addClass, getClasses, deleteClass } from "./actions";

const DAY_OPTIONS = [
  { label: "M", value: "M" },
  { label: "T", value: "Tu" },
  { label: "W", value: "W" },
  { label: "Th", value: "Th" },
  { label: "F", value: "F" },
  { label: "S", value: "Sa" },
  { label: "Su", value: "Su" },
];

export default function CalendarPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);

  // State for the Day Picker UI
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const loadData = async () => {
    setFetching(true);
    try {
      const [classData, buildingRes] = await Promise.all([
        getClasses(),
        fetch("/api/buildings")
      ]);
      setClasses(classData || []);
      if (buildingRes.ok) setBuildings(await buildingRes.json());
    } catch (err) {
      console.error("Failed to load calendar data:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleDay = (val: string) => {
    setSelectedDays(prev => prev.includes(val) ? prev.filter(d => d !== val) : [...prev, val]);
  };

  async function handleAddClass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedDays.length === 0) return alert("Select at least one day!");
    
    setAdding(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const rawTime = formData.get("rawTime") as string;
    if (!rawTime) {
      setAdding(false);
      return;
    }

    // Parse "14:30" -> "2:30 PM"
    const [hours, mins] = rawTime.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHours = h % 12 || 12;
    
    // Create the final string: "MWF 2:30 PM"
    const formattedTime = `${selectedDays.join("")} ${displayHours}:${mins.padStart(2, '0')} ${ampm}`;
    
    formData.set("time", formattedTime);

    try {
      await addClass(formData);
      
      // RESET LOGIC: Manually clear inputs to avoid the "Invalid Value" browser bug
      const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
      const timeInput = form.querySelector('input[name="rawTime"]') as HTMLInputElement;
      if (nameInput) nameInput.value = "";
      if (timeInput) timeInput.value = "12:00"; 
      
      setSelectedDays([]);
      await loadData();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-32 px-6 bg-[#f8fafc] flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-10 text-center">
          My Schedule
        </h1>

        <form onSubmit={handleAddClass} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="name" 
              placeholder="Class Name (e.g. CSCE 3600)" 
              required 
              className="px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#00853E] bg-white transition-all" 
            />
            
            <select 
              name="location" 
              required 
              defaultValue="" 
              className="px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#00853E] bg-white transition-all appearance-none"
            >
              <option value="" disabled>Select Building</option>
              {buildings.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* DAY PICKER UI */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 ml-2">Select Days</p>
            <div className="flex flex-wrap gap-2">
              {DAY_OPTIONS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    selectedDays.includes(day.value) 
                    ? "bg-[#00853E] text-white scale-105 shadow-md" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* TIME PICKER UI */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 ml-2">Class Start Time</p>
            <input 
              type="time" 
              name="rawTime" 
              required 
              defaultValue="12:00"
              className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#00853E] bg-white transition-all" 
            />
          </div>

          <button 
            disabled={adding} 
            type="submit" 
            className="w-full bg-[#00853E] text-white font-bold py-4 rounded-2xl hover:bg-[#006b32] transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {adding ? <Loader2 className="animate-spin" /> : <Plus size={20} />} 
            Add to Schedule
          </button>
        </form>

        {/* LIST SECTION */}
        <div className="space-y-4">
          {fetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-[#00853E]" />
            </div>
          ) : classes.length > 0 ? (
            classes.map((cls) => (
              <div key={cls.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:border-[#00853E]/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="bg-[#00853E]/10 p-4 rounded-2xl text-[#00853E]">
                    <Calendar size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl text-gray-900">{cls.name}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500 font-semibold">
                      <span className="flex items-center gap-1"><Clock size={14}/> {cls.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={14}/> {cls.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/home?location=${encodeURIComponent(cls.location)}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00853E] text-white text-sm font-bold rounded-xl hover:bg-[#006b32] transition-all"
                  >
                    <Navigation size={16} /> Navigate
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm("Delete class?")) deleteClass(cls.id).then(loadData);
                    }} 
                    className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">Empty schedule. Start by adding a class above.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}