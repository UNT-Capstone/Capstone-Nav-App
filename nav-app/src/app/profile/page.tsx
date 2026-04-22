import React from "react";
import { requireAuth } from "@/src/lib/auth-utils";
import prisma from "@/src/lib/prisma";

// 1. FORCE DYNAMIC: Ensures fresh data on every visit
export const dynamic = "force-dynamic";
export const revalidate = 0;

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const timeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const ProfilePage = async () => {
  // 2. AUTH CHECK: requireAuth is a dynamic function (checks cookies)
  const session = await requireAuth();
  const userEmail = session?.user?.email;

  if (!userEmail) return <div className="p-10 text-center">Unauthorized</div>;

  // 3. OPTIMIZED QUERY: Only fetch what we need
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      name: true,
      email: true,
      image: true,
      favoriteLocations: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      searchHistory: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-[#00853E]">
        User data not found in database.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center">
      {/* HEADER SECTION */}
      <div className="w-full bg-[#00853E] pb-20 px-6 pt-28 flex flex-col items-center text-center -mt-28">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
          Profile
        </h1>
        <p className="text-green-100 font-medium">UNT Campus Navigator</p>
      </div>

      <div className="w-full max-w-2xl px-6 -mt-12 space-y-6 pb-20">
        
        {/* PROFILE CARD */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl bg-[#00853E]/10 flex items-center justify-center text-[#00853E] text-4xl font-black overflow-hidden border-4 border-white shadow-lg">
            {user.image ? (
              <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name || "User")
            )}
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="border-b border-gray-50 pb-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
              <p className="text-xl font-bold text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email</label>
              <p className="text-lg font-semibold text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* RECENT FAVORITES */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900">Recent Favorites</h3>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
              Last 5 saved
            </span>
          </div>

          {user.favoriteLocations.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-semibold">No favorite places yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {user.favoriteLocations.map((place) => (
                <li
                  key={place.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">{place.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      {timeAgo(place.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RECENT SEARCH ACTIVITY */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900">Recent Search Activity</h3>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
              Last 5 searches
            </span>
          </div>

          {user.searchHistory.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-semibold">No recent searches found.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {user.searchHistory.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/60"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">"{item.query}"</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
