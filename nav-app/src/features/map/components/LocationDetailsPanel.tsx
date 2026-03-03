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
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[998] flex flex-col">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Close panel"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Placeholder Image */}
        <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 flex items-center justify-center">
          <MapPin size={48} className="text-gray-400" />
        </div>

        {/* Location Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {location.name}
        </h3>

        {/* Location Coordinates */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Latitude:</span> {location.lat.toFixed(4)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Longitude:</span> {location.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Button Container */}
      <div className="border-t p-6 space-y-3">
        {/* Direction Button */}
        <button
          onClick={onDirections}
          className="w-full bg-[#00853E] hover:bg-[#006b31] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <MapPin size={20} />
          Get Directions
        </button>

        {/* Add to Favorites Button */}
        <button
          onClick={() => setIsAddedToFavorites(!isAddedToFavorites)}
          className={`w-full font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 ${
            isAddedToFavorites
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart size={20} fill={isAddedToFavorites ? "currentColor" : "none"} />
          {isAddedToFavorites ? "Saved" : "Add to Favorites"}
        </button>

        {/* Create Event Button */}
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
          <Calendar size={20} />
          Create Event
        </button>
      </div>
    </div>
  );
}
