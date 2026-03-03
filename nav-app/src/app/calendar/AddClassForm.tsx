"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, Loader2, XIcon } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog"; // Ensure this is installed
import { addClass } from "@/src/app/calendar/actions";
import { cn } from "../../../lib/utils";

// --- DIALOG PRIMITIVES (Internal to this file) ---
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=initial]:fade-in-0 data-[state=closed]:fade-out-0",
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
        "fixed left-[50%] top-[50%] z-[3001] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 sm:rounded-[2.5rem]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-full p-2 opacity-70 transition-opacity hover:bg-gray-100 hover:opacity-100 outline-none">
        <XIcon className="h-5 w-5 text-gray-500" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// --- MAIN FORM COMPONENT ---
export function AddClassForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      await addClass(formData);
      setOpen(false); 
    } catch (error) {
      console.error("Failed to add class", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[#00853E] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#006a31] transition-all shadow-lg active:scale-95">
          <Plus className="w-6 h-6" />
          <span>Add Class</span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <div className="mb-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add New Class</h2>
          <p className="text-gray-500 font-medium">Enter your course details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Class Name</label>
            <input
              name="name"
              required
              placeholder="e.g. CSCE 1030"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00853E] outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Location</label>
            <input
              name="location"
              placeholder="e.g. Discovery Park B120"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00853E] outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Time</label>
            <input
              name="time"
              placeholder="e.g. MWF 10:00 AM"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00853E] outline-none transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00853E] text-white py-4 rounded-2xl font-black text-lg mt-4 hover:bg-[#006a31] transition-all disabled:opacity-50 flex justify-center items-center shadow-xl shadow-green-900/20"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Class"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}