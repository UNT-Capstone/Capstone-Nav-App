'use client';

import Link from "next/link";
import { 
  NavigationMenuItem, 
  NavigationMenuLink, 
} from "@/components/ui/navigation-menu";
import { 
  FaUserCircle, 
  FaCalendarAlt, 
  FaUser, 
  FaInfoCircle, 
  FaRegCalendarCheck,
  FaSignOutAlt 
} from 'react-icons/fa'; // Added icon imports
import { LogoutButton } from "@/src/features/auth/components/logout-button";
import { useState, useRef, useEffect } from 'react';

export const ConditionalElements = ({ authenticated }: { authenticated: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Logged out state
  if (!authenticated) {
    return (
      <>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/login" className="px-3 hover:text-green-200 transition-colors">Login</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/signup" className="px-3 hover:text-green-200 transition-colors font-bold bg-[#00853E] rounded-md py-1.5 ml-2">Signup</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </>
    );
  }

  // Logged in state
  return (
    <NavigationMenuItem className="hidden md:block">
      <div className="relative" ref={menuRef}>
        <button 
          aria-label="Profile menu" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-transparent focus:outline-none flex items-center transition-transform active:scale-95 py-1"
        >
          <FaUserCircle size={32} className="text-white hover:text-green-200 transition-colors shadow-sm" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-52 z-[100] animate-in fade-in zoom-in duration-150">
            <ul className="grid w-full gap-1 p-2 bg-white text-black rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
              
              {/* Branding/Header Section */}
              <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Student Portal
              </div>
              
              <li>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg transition-all group"
                  >
                    <div className="p-1.5 bg-gray-50 group-hover:bg-green-50 rounded-md transition-colors">
                      <FaUser className="text-gray-400 group-hover:text-[#00853E] text-sm" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">My Profile</span>
                  </Link>
                </NavigationMenuLink>
              </li>

              {/* SCHEDULE BUTTON - Pointing to your /calendar route */}
              <li>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/calendar" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg transition-all group"
                  >
                    <div className="p-1.5 bg-gray-50 group-hover:bg-blue-50 rounded-md transition-colors">
                      <FaCalendarAlt className="text-gray-400 group-hover:text-blue-600 text-sm" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Schedule</span>
                  </Link>
                </NavigationMenuLink>
              </li>

              <div className="my-1.5 border-t border-gray-50" />

              {/* DISCOVER SECTION */}
              <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Discover
              </div>

              <li>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/events" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg transition-all group"
                  >
                    <div className="p-1.5 bg-gray-50 group-hover:bg-purple-50 rounded-md transition-colors">
                      <FaRegCalendarCheck className="text-gray-400 group-hover:text-purple-600 text-sm" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Events</span>
                  </Link>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/about" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg transition-all group"
                  >
                    <div className="p-1.5 bg-gray-50 group-hover:bg-orange-50 rounded-md transition-colors">
                      <FaInfoCircle className="text-gray-400 group-hover:text-orange-500 text-sm" />
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">About UNT</span>
                  </Link>
                </NavigationMenuLink>
              </li>

              <div className="my-1.5 border-t border-gray-100" />

              {/* LOGOUT BUTTON */}
              <li className="px-1 pb-1">
                <div className="flex items-center gap-3 w-full p-2.5 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer transition-all group">
                   <FaSignOutAlt className="ml-1 text-sm opacity-70" />
                   <LogoutButton />
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </NavigationMenuItem>
  );
};