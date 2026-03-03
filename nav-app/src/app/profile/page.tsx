import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth"; 
import { headers } from "next/headers";
import prisma from "@/src/lib/prisma";
import Image from "next/image";
import { Search, GraduationCap, Calendar, Mail, MapPin, Clock } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      searchHistory: {
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Main Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-[#00853E]" /> {/* UNT Green */}
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="p-1.5 bg-white rounded-2xl shadow-md">
                {userData?.image ? (
                  <Image
                    src={userData.image}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-[120px] w-[120px] rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <GraduationCap size={48} className="text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    {userData?.name}
                  </h1>
                  <p className="flex items-center gap-2 text-gray-500 font-medium mt-1">
                    <Mail size={16} /> {userData?.email}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-green-50 text-[#00853E] text-xs font-bold rounded-full border border-green-100">
                    Student Verified
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Right Column: Academic Details (Major/Year) */}
              <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 gap-4 border border-gray-100">
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Major</p>
                  <p className="font-bold text-gray-800 text-lg leading-tight">
                    {/* Accessing custom fields from the User model */}
                    {(userData as any)?.major || "Not Set"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Classification</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {(userData as any)?.year || "Not Set"}
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200 mt-2 flex items-center gap-2 text-gray-500 text-sm">
                   <MapPin size={14} /> <span>University of North Texas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-[#00853E]" size={22} />
              Recent Navigations
            </h2>
          </div>

          {!userData?.searchHistory?.length ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
              <Search className="mx-auto text-gray-200 mb-3" size={40} />
              <p className="text-gray-400 font-medium">Your search history is empty</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {userData.searchHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.query}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}