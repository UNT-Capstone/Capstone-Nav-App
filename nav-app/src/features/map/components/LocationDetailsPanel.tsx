"use client";

import { X, MapPin, Heart, Calendar } from "lucide-react";
import { useState } from "react";

interface LocationDetailsPanelProps {
  location: {
    name: string;
    lat: number;
    lng: number;
  } | null;
  onClose: () => void;
  onDirections: () => void;
}

export default function LocationDetailsPanel({
  location,
  onClose,
  onDirections,
}: LocationDetailsPanelProps) {
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);

  if (!location) return null;

  return (
    <div
      className="
        fixed left-2 top-24
        w-[90vw] max-w-sm
        max-h-[calc(100vh-6rem)]
        bg-white shadow-2xl
        z-[10000]
        flex flex-col
        rounded-lg
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="text-lg font-bold text-gray-800">
          Location Details
        </h2>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Close panel"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {location.name}
        </h3>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Latitude:</span>{" "}
            {location.lat.toFixed(4)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Longitude:</span>{" "}
            {location.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="border-t p-4 space-y-2 shrink-0 bg-white">
        {/* Directions */}
        <button
          onClick={onDirections}
          className="w-full bg-[#00853E] hover:bg-[#006b31] text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          Get Directions
        </button>

        {/* Favorites */}
        <button
          onClick={() => setIsAddedToFavorites((prev) => !prev)}
          className={`w-full font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 ${
            isAddedToFavorites
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart
            size={18}
            fill={isAddedToFavorites ? "currentColor" : "none"}
          />
          {isAddedToFavorites ? "Saved" : "Add to Favorites"}
        </button>

        {/* Event */}
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2">
          <Calendar size={18} />
          Create Event
        </button>
      </div>
    </div>
  );
}