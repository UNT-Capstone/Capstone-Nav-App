"use client";

export default function ParkingOverlay() {
  return (
    <div className="absolute inset-0 z-[500] pointer-events-auto">
      <iframe
        src="https://experience.arcgis.com/experience/5b6f7d38a75b4f6e84c81eae31216267/page/Main-Page?views=Parking-Category-List,Parking-List"
        className="w-full h-full border-none"
        loading="lazy"
      />
    </div>
  );
}
