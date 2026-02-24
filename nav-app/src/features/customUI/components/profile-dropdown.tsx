'use client';

import Link from "next/link";
import { 
  NavigationMenuItem, 
  NavigationMenuLink, 
} from "@/components/ui/navigation-menu";
import { FaUserCircle } from 'react-icons/fa';
import { LogoutButton } from "@/src/features/auth/components/logout-button";
import { useState, useRef, useEffect } from 'react';

export const ConditionalElements = ({ authenticated }: { authenticated: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
            <Link href="/signup" className="px-3 hover:text-green-200 transition-colors">Signup</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </>
    );
  }

  return (
    <NavigationMenuItem className="hidden md:block">
      <div className="relative" ref={menuRef}>
        <button 
          aria-label="Profile menu" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-transparent focus:outline-none">
          <FaUserCircle size={32} className="text-white" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-44 z-50">
            <ul className="grid w-[160px] gap-2 p-2 bg-white text-black rounded-md shadow-lg border">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/profile" className="block p-2 hover:bg-gray-100 rounded transition-colors">Profile</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/events" className="block p-2 hover:bg-gray-100 rounded transition-colors">Events</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="block p-2 hover:bg-gray-100 rounded transition-colors">About</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <div className="block p-2 hover:bg-gray-100 rounded cursor-pointer text-red-600 transition-colors">
                    <LogoutButton/>
                  </div>
                </NavigationMenuLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </NavigationMenuItem>
  );
};
