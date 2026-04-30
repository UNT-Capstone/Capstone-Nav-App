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


const DAY_ORDER = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];

export default function CalendarClientPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

 
  const loadData = async () => {
    setFetching(true);
    try {
      // 1. Fetch user classes from Prisma (via Server Action)
      try {
        const classData = await getClasses();
        setClasses(classData || []);
      } catch (err) {
        // Log the error but keep the app running
        console.error("Database connection failed (Prisma):", err);
        setClasses([]);
      }

      // 2. Fetch hardcoded UNT building data from the local API route
      const buildingRes = await fetch("/api/buildings");
      if (buildingRes.ok) {
        const buildingData = await buildingRes.json();
        setBuildings(buildingData);
      } else {
        console.error("Failed to fetch building list from API.");
      }
    } catch (err) {
      console.error("General initialization error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleDay = (val: string) => {
    setSelectedDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
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

    // Convert 24h format (input type="time") to 12h format for the display string
    const [hours, mins] = rawTime.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHours = h % 12 || 12;

    // Sort days into canonical order so "FMW" becomes "MWF" consistently
    const sortedDays = [...selectedDays].sort(
      (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
    );

    const formattedTime = `${sortedDays.join("")} ${displayHours}:${mins.padStart(2, "0")} ${ampm}`;

    formData.set("time", formattedTime);

    try {
      await addClass(formData);
      form.reset(); // Clear the form text inputs
      setSelectedDays([]); // Clear the day picker
      await loadData(); // Refresh the list
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to add class. Check database connection.");
    } finally {
      setAdding(false);
    }
  }

  
  const handleNavigate = (locationName: string) => {
    const building = buildings.find((b) => b.name === locationName);

    if (!building) {
      // Building not found in local list — fall back to name-based lookup
      router.push(`/home?location=${encodeURIComponent(locationName)}`);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
 
          router.push(
            `/home?lat=${building.lat}&lng=${building.lng}&fromLat=${pos.coords.latitude}&fromLng=${pos.coords.longitude}`
          );
        },
        () => {
          // GPS denied or failed — map will fall back to campus default as start
          router.push(`/home?lat=${building.lat}&lng=${building.lng}`);
        }
      );
    } else {
      // Geolocation not supported — just send destination
      router.push(`/home?lat=${building.lat}&lng=${building.lng}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 pt-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Schedule</h1>

        {/* Add Class Form */}
        <form
          onSubmit={handleAddClass}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10 space-y-6"
        >
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
              <option value="" disabled>
                {fetching ? "Loading UNT Buildings..." : "Select Building"}
              </option>
              {buildings.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Day Selection */}
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

          {/* Start Time Input */}
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

        {/* Display List of Classes */}
        <div className="space-y-4">
          {fetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-[#00853E]" />
            </div>
          ) : classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:border-[#00853E]/20 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-[#00853E]/10 p-4 rounded-2xl text-[#00853E]">
                    <Calendar size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl text-gray-900">{cls.name}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {cls.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {cls.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNavigate(cls.location)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00853E] text-white text-sm font-bold rounded-xl hover:bg-[#006b32] transition-all"
                  >
                    <Navigation size={16} /> Navigate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this class?")) deleteClass(cls.id).then(loadData);
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
              <p className="text-gray-400 font-bold">No classes found. Add your first class above!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
