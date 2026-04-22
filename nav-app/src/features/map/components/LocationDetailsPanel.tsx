"use client";

import { X, MapPin, Heart, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(false);

  // Check if location is already favorited on component mount
  useEffect(() => {
    if (!location) return;

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch("/api/trpc/isFavoriteLocation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: location.name,
            lat: location.lat,
            lng: location.lng,
          }),
        });

        if (!response.ok) {
          console.error("Failed to check favorite status:", response.statusText);
          return;
        }

        const data = await response.json();
        setIsAddedToFavorites(data.result?.data ?? false);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [location]);

  const handleFavoriteClick = async () => {
    if (!location) return;

    setIsLoading(true);

    try {
      const endpoint = isAddedToFavorites
        ? "removeFavoriteLocation"
        : "addFavoriteLocation";

      const response = await fetch(`/api/trpc/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: location.name,
          lat: location.lat,
          lng: location.lng,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error updating favorite: ${response.statusText}`, errorText);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("Error from server:", data.error);
        setIsLoading(false);
        return;
      }

      setIsAddedToFavorites((prev) => !prev);
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!location) return null;

  return (
    <div
      className="
        fixed left-2 top-[60%] md:top-1/2 md:-translate-y-1/2 -translate-y-1/2 md:left-4
        w-[85vw] max-w-xs md:max-w-sm
        max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-6rem)]
        bg-white shadow-2xl
        z-[10000]
        flex flex-col
        rounded-lg
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b bg-white">
        <h2 className="text-base md:text-lg font-bold text-gray-800">
          Location Details
        </h2>

        <button
          onClick={onClose}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Close panel"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">
          {location.name}
        </h3>

        <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
          <p className="text-xs md:text-sm text-gray-600 mb-1">
            <span className="font-medium">Latitude:</span>{" "}
            {location.lat.toFixed(4)}
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            <span className="font-medium">Longitude:</span>{" "}
            {location.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="border-t p-3 md:p-4 space-y-2 shrink-0 bg-white">
        {/* Directions */}
        <button
          onClick={onDirections}
          className="w-full bg-[#00853E] hover:bg-[#006b31] text-white font-semibold py-2.5 md:py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <MapPin size={16} className="md:w-5 md:h-5" />
          Get Directions
        </button>

        {/* Favorites */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`w-full font-semibold py-2.5 md:py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed ${
            isAddedToFavorites
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart
            size={16}
            fill={isAddedToFavorites ? "currentColor" : "none"}
            className="md:w-5 md:h-5"
          />
          {isLoading
            ? "Loading..."
            : isAddedToFavorites
              ? "Saved"
              : "Add to Favorites"}
        </button>

        {/* Event */}
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 md:py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base">
          <Calendar size={16} className="md:w-5 md:h-5" />
          Create Event
        </button>
      </div>
    </div>
  );
}
