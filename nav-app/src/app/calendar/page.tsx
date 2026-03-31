"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Loader2, 
  XIcon, 
  Calendar, 
  MapPin, 
  Clock, 
  Navigation, 
  Trash2 
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog"; 
import { addClass, getClasses, deleteClass } from "@/src/app/calendar/actions";
import { cn } from "../../../lib/utils";

// --- 1. DIALOG PRIMITIVES ---
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[3001] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border bg-white p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 sm:rounded-[2.5rem] outline-none max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-full p-2 opacity-70 transition-opacity hover:bg-gray-100">
        <XIcon className="h-5 w-5 text-gray-500" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// --- Helper: Convert 24h time to 12h AM/PM format ---
function formatTime12Hour(time24: string) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  return `${hour}:${minute} ${ampm}`;
}

// --- 2. ADD FORM COMPONENT ---
function AddClassForm({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<{name: string}[]>([]);

  // Fetch building list for the dropdown
  useEffect(() => {
    fetch("/api/buildings")
      .then(res => res.json())
      .then(data => setBuildings(data))
      .catch(err => console.error("Failed to fetch buildings", err));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    
    // 1. Gather all checked days (e.g., ["M", "W", "F"]) and join them ("MWF")
    const selectedDays = formData.getAll("days").join("");
    
    // 2. Get raw time ("14:30") and format it ("2:30 PM")
    const rawTime = formData.get("rawTime") as string;
    const formattedTime = formatTime12Hour(rawTime);
    
    // 3. Combine them into the exact format your DB expects: "MWF 2:30 PM"
    const finalTimeString = `${selectedDays} ${formattedTime}`.trim();

    // 4. Create a fresh FormData object to send to the server action
    const submissionData = new FormData();
    submissionData.append("name", formData.get("name") as string);
    submissionData.append("location", formData.get("location") as string);
    submissionData.append("time", finalTimeString);

    try {
      await addClass(submissionData);
      setOpen(false); 
      onRefresh(); 
    } catch (error) {
      console.error("Failed to add class", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 bg-[#00853E] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#006a31] transition-all shadow-xl shadow-green-900/20 active:scale-95 text-lg">
          <Plus className="w-6 h-6 stroke-[3]" />
          <span>Add Class</span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <div className="mb-2 text-left">
          <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight">
            Add New Class
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium mt-1">
            Set up your schedule for notifications and navigation.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Subject Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Subject Name</label>
            <input 
              name="name" 
              required 
              placeholder="e.g. CSCE 1030" 
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00853E] outline-none" 
            />
          </div>

          {/* Location Dropdown (Dynamic) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Class Location</label>
            <select 
          name="location" 
          required
          defaultValue="" 
          className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00853E] outline-none appearance-none"
>
  <option value="" disabled>Select a campus building...</option>
              {buildings.map((b, i) => (
                <option key={i} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Day & Time Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Days Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Days</label>
              <div className="flex gap-2">
                {["M", "Tu", "W", "Th", "F"].map((day) => (
                  <label key={day} className="relative cursor-pointer">
                    <input type="checkbox" name="days" value={day} className="peer sr-only" />
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 peer-checked:bg-[#00853E] peer-checked:text-white peer-checked:border-[#00853E] transition-all">
                      {day}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Start Time</label>
              <input 
                type="time" 
                name="rawTime" 
                required 
                className="w-full px-5 py-3 h-10 box-content rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00853E] outline-none" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#00853E] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#006a31] transition-all disabled:opacity-50 flex justify-center items-center shadow-xl shadow-green-900/20">
            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : "Save Class"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- 3. FULL PAGE DEFAULT EXPORT ---
export default function CalendarPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this class from your schedule?")) return;
    try {
      await deleteClass(id);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-32 px-6 bg-[#f8fafc] flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col items-center">
        
        <div className="text-center mb-16">
          <span className="text-[#00853E] font-bold uppercase tracking-[0.2em] text-xs mb-3 block">
            Academic Organizer
          </span>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-10">
            My Schedule
          </h1>
          <AddClassForm onRefresh={fetchClasses} />
        </div>

        {fetching ? (
          <Loader2 className="w-10 h-10 animate-spin text-[#00853E]" />
        ) : classes.length > 0 ? (
          <div className="w-full space-y-4">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
                <div className="flex items-center gap-6">
                  <div className="bg-green-50 p-5 rounded-[1.5rem] group-hover:bg-[#00853E]/10 transition-colors">
                    <Calendar className="w-8 h-8 text-[#00853E]" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-gray-800 tracking-tight">{cls.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 font-bold">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#00853E]" />{cls.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#00853E]" />{cls.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   {/* NAVIGATE BUTTON: Takes user to Home map and draws the line */}
                  <Link 
                    href={`/?location=${encodeURIComponent(cls.location)}`}
                    className="bg-[#00853E] hover:bg-[#006a31] text-white p-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-900/10 flex items-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    <span className="font-bold hidden sm:inline pr-1">Navigate</span>
                  </Link>

                  <button 
                    onClick={() => handleDelete(cls.id)}
                    className="p-4 rounded-2xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full p-20 border-2 border-dashed border-gray-200 rounded-[3.5rem] text-center bg-white/50 backdrop-blur-sm shadow-sm flex flex-col items-center">
             <div className="bg-gray-100 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-6">
               <Calendar className="text-gray-400 w-10 h-10" />
             </div>
             <h3 className="text-2xl font-black text-gray-800 tracking-tight">No classes found</h3>
             <p className="text-gray-500 mt-3 font-medium text-lg max-w-[280px]">Add your UNT courses to start navigating easily.</p>
          </div>
        )}
      </div>
    </main>
  );
}