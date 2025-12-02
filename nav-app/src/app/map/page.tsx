"use client";

import { useState } from "react";
import UNTLiveMap from "@/components/UNTLiveMap";
import UNTSearchBar from "@/components/UNTSearchBar";
import UNTEventsWidget from "@/components/UNTEventsWidgets";

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <main className="flex flex-col items-center p-4 space-y-6 w-full">
      <UNTSearchBar onSelect={setSelectedLocation} />

      <UNTLiveMap selectedLocation={selectedLocation} />

      <div className="w-full max-w-5xl">
        <UNTEventsWidget />
      </div>
    </main>
  );
}
