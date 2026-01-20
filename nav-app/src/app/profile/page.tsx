import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/src/lib/auth-utils';
import prisma from "@/src/lib/prisma";

// Helper function to get initials (e.g., "Nikhil Karki" -> "NK")
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ProfilePage = async () => {

  const session = await requireAuth();
  
 
  const userEmail = session?.user?.email;

  let user = null;
  if (userEmail) {
    user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
  }

 
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
        <p>Could not retrieve profile data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8">
      
      {/* Page Title - Matching Home Page Style */}
      <h1 className="text-3xl font-bold text-[#00853E] mb-2">My Profile</h1>
      <p className="mb-8 text-gray-600">Manage your account and view activity.</p>

      <div className="w-full max-w-4xl px-4 space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex items-center space-x-6">
          {/* Avatar Circle */}
          <div className="w-24 h-24 rounded-full bg-[#00853E] flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {user.image ? (
              <img 
                src={user.image} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              getInitials(user.name || 'User')
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            {/* Show Major if it exists in DB, otherwise placeholder */}
            <p className="text-[#00853E] font-medium text-lg">
              {(user as any).major || 'Computer Science'}
            </p>
            <p className="text-gray-500 text-sm">
              Student ID: {(user as any).studentId || 'Not Set'}
            </p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Info */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#00853E] mb-4">Student Details</h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </li>
              <li className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-600">Academic Year:</span>
                <span className="text-gray-800">{(user as any).year || 'Junior'}</span>
              </li>
              <li className="flex justify-between border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-600">Campus:</span>
                <span className="text-gray-800">Denton / Discovery Park</span>
              </li>
            </ul>
          </div>

          {/* Quick Links (Styled like UNT Widgets) */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#00853E] mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              <Link 
                href="/campus-map" 
                className="block p-3 rounded-lg bg-green-50 text-[#00853E] hover:bg-[#00853E] hover:text-white transition-colors font-medium"
              >
                 📍 Campus Map
              </Link>
              <Link 
                href="/buildings" 
                className="block p-3 rounded-lg bg-green-50 text-[#00853E] hover:bg-[#00853E] hover:text-white transition-colors font-medium"
              >
                 🏢 Buildings Directory
              </Link>
              <Link 
                href="/schedule" 
                className="block p-3 rounded-lg bg-green-50 text-[#00853E] hover:bg-[#00853E] hover:text-white transition-colors font-medium"
              >
                 📅 Class Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-[#00853E] mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 border-b border-gray-50 pb-3 last:border-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#00853E]"></div>
              <div>
                <p className="text-gray-800 font-medium">Checked into Willis Library</p>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </li>
            <li className="flex items-start space-x-3 border-b border-gray-50 pb-3 last:border-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#00853E]"></div>
              <div>
                <p className="text-gray-800 font-medium">Viewed Discovery Park Map</p>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </li>
             <li className="flex items-start space-x-3 border-b border-gray-50 pb-3 last:border-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#00853E]"></div>
              <div>
                <p className="text-gray-800 font-medium">Searched for "Union Building"</p>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;