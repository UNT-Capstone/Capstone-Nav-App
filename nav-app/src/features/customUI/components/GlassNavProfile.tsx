'use client';

import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { LogoutButton } from '../../auth/components/logout-button';
import { useState, useRef, useEffect } from 'react';

export function GlassNavProfile() {
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

  // Shared class for menu items to keep code clean
  const menuItemClass = "block px-4 py-2 hover:bg-gray-200/70 active:bg-gray-300/80 rounded-lg transition-all duration-200 font-medium text-gray-700 hover:text-gray-900";

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button 
        aria-label="Profile menu" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-2.5 rounded-full 
                   bg-white/90 hover:bg-gray-100 border border-gray-200
                   backdrop-blur-md transition-all active:scale-95 shadow-sm"
      >
        <FaUserCircle className="text-2xl text-gray-600" />
        <span className="text-base font-semibold text-gray-700 hidden md:block">Profile</span>
      </button>

      {/* Matte Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="grid gap-1 p-1.5 rounded-xl shadow-xl border border-gray-200 
                         bg-white/98 backdrop-blur-sm">
            <li>
              <Link href="/profile" className={menuItemClass} onClick={() => setIsOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/UNTEvents" className={menuItemClass} onClick={() => setIsOpen(false)}>
                Events
              </Link>
            </li>
            <li>
              <Link href="/" className={menuItemClass} onClick={() => setIsOpen(false)}>
                Map
              </Link>
            </li>
            <li>
              <Link href="/about" className={menuItemClass} onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            
            <li className="mt-1 pt-1 border-t border-gray-100">
              {/* Wrapping Logout in a div to apply the same hover logic if needed */}
              <div className="hover:bg-gray-200/70 rounded-lg transition-all duration-200" onClick={() => setIsOpen(false)}>
                <LogoutButton />
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}