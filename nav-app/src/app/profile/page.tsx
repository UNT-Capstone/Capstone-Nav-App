import React from "react";
import { requireAuth } from "@/src/lib/auth-utils";
import prisma from "@/src/lib/prisma";

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

  const intervals: any = {
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
  const session = await requireAuth();
  const userEmail = session?.user?.email;

  let user = null;

  if (userEmail) {
    user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        searchHistory: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#00853E] to-[#00A651] py-10 -mt-28">

      <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
      <p className="mb-8 text-green-100">
        Manage your account and view activity.
      </p>

      <div className="w-full max-w-4xl px-4 space-y-6">

        {/* PROFILE HEADER */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-6">

          <div className="w-24 h-24 rounded-full bg-[#00853E] flex items-center justify-center text-white text-3xl font-bold">
            {user.image ? (
              <img
                src={user.image}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.name || "User")
            )}
          </div>

          <div className="w-full">
            <ul className="space-y-2">

              <li className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="text-gray-800 font-semibold">
                  {user.name}
                </span>
              </li>

              <li className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </li>

            </ul>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-[#00853E] mb-4">
            Recent Activity
          </h3>

          {user.searchHistory.length === 0 ? (
            <p className="text-gray-500">No activity yet</p>
          ) : (
            <ul className="space-y-4">
              {user.searchHistory.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start space-x-3 border-b pb-3 last:border-0"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#00853E]" />
                  <div>
                    <p className="text-gray-800 font-medium">
                      Searched for "{item.query}"
                    </p>
                    <span className="text-xs text-gray-500">
                      {timeAgo(item.createdAt)}
                    </span>
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
