import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/src/lib/auth-utils';
import prisma from "@/src/lib/prisma";
import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaUserGraduate, FaIdCard, FaUniversity } from 'react-icons/fa';

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">User not found</h1>
        <p className="text-gray-500 font-medium">Could not retrieve profile data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
    
      <div className="bg-white border-b border-gray-100 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
            My <span className="text-[#00853E]">Profile</span>
          </h1>
          <p className="text-lg font-bold text-gray-400 mt-2 uppercase tracking-widest">
            Student Dashboard & Activity
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-3xl bg-[#00853E] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover -rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                ) : (
                  getInitials(user.name || 'User')
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
              {user.name?.toUpperCase()}
            </h2>
            <p className="text-[#00853E] font-black text-sm uppercase tracking-widest mb-4">
              {(user as any).major || 'Computer Science'}
            </p>
            
            <div className="w-full pt-6 border-t border-gray-50 flex flex-col gap-3">
               <div className="flex items-center gap-3 text-gray-500 text-sm font-bold uppercase tracking-tight">
                  <FaIdCard className="text-[#00853E]" />
                  <span>ID: {(user as any).studentId || '24-001028'}</span>
               </div>
               <div className="flex items-center gap-3 text-gray-500 text-sm font-bold uppercase tracking-tight">
                  <FaUniversity className="text-[#00853E]" />
                  <span>Denton / Discovery Park</span>
               </div>
            </div>
          </div>

          {/* Quick Widgets - Matching App Aesthetics */}
          <div className="bg-black rounded-3xl p-6 text-white">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Navigation Shortcuts</h3>
            <div className="space-y-2">
              <Link href="/home" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3 font-bold text-sm">
                  <FaMapMarkerAlt className="text-[#00853E]" /> Campus Map
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
              <Link href="/calendar" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3 font-bold text-sm">
                  <FaCalendarAlt className="text-[#00853E]" /> My Schedule
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-green-50 rounded-lg"><FaUserGraduate className="text-[#00853E]" /></div>
                 <h3 className="text-lg font-black tracking-tight uppercase">Academic Info</h3>
              </div>
              <ul className="space-y-4 font-bold text-sm">
                <li className="flex justify-between text-gray-400">EMAIL <span className="text-gray-900">{user.email}</span></li>
                <li className="flex justify-between text-gray-400">YEAR <span className="text-gray-900">{(user as any).year || 'Senior'}</span></li>
                <li className="flex justify-between text-gray-400">STATUS <span className="text-green-600">ACTIVE</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-green-50 rounded-lg"><FaBuilding className="text-[#00853E]" /></div>
                 <h3 className="text-lg font-black tracking-tight uppercase">Top Locations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Willis Library', 'Discovery Park', 'Union'].map(loc => (
                  <span key={loc} className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase text-gray-500 border border-gray-100">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
             <h3 className="text-lg font-black tracking-tight uppercase mb-8 flex items-center gap-3">
               <span className="w-2 h-6 bg-[#00853E] rounded-full inline-block"></span>
               Recent Activity
             </h3>
             <div className="space-y-8 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-50"></div>
                
                {[
                  { title: "Checked into Willis Library", time: "2 hours ago" },
                  { title: "Viewed Discovery Park Map", time: "1 day ago" },
                  { title: "Searched for 'Union Building'", time: "3 days ago" }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-[#00853E] shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                    <p className="text-sm font-black text-gray-900 tracking-tight">{item.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.time}</p>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;