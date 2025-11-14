import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6">
          <img
            src="/path-to-avatar.jpg"
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">NAME LAST NAME</h1>
            <p className="text-gray-600">xx Major</p>
            <p className="text-gray-500">Student ID: XXXX</p>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>
          <ul className="space-y-2">
            <li>
              <strong>Email:</strong> abc@unt.edu
            </li>
            <li>
              <strong>Major:</strong> Computer Science
            </li>
            <li>
              <strong>Year:</strong> Junior
            </li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="border-b pb-2">
              <p className="text-gray-800">Checked into Willis Library</p>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </li>
            <li className="border-b pb-2">
              <p className="text-gray-800">Viewed Discovery Park Map</p>
              <span className="text-sm text-gray-500">1 day ago</span>
            </li>
            <li className="border-b pb-2">
              <p className="text-gray-800">Searched for "Union Building"</p>
              <span className="text-sm text-gray-500">3 days ago</span>
            </li>
          </ul>
        </div>

        {/* Campus Links */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/campus-map" className="text-green-600 hover:underline">
                Campus Map
              </a>
            </li>
            <li>
              <a href="/buildings-directory" className="text-green-600 hover:underline">
                Buildings Directory
              </a>
            </li>
            <li>
              <a href="/class-schedule" className="text-green-600 hover:underline">
                Class Schedule
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;