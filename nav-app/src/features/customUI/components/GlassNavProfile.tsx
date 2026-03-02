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

  return (
    <div className="relative group" ref={menuRef}>
      <button 
        aria-label="Profile menu" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-2.5 rounded-full 
                       bg-white/30 hover:bg-white/50 border border-white/50
                       backdrop-blur-xl transition-all active:scale-90 shadow-md">
        <FaUserCircle className="text-2xl text-gray-700" />
        <span className="text-base font-bold text-gray-800 hidden md:block">Profile</span>
      </button>

      {(isOpen || true) && (
        <div className="absolute right-0 mt-1 w-44 z-50 hidden group-hover:block" style={{display: isOpen ? 'block' : ''}}>
          <ul className="grid gap-2 p-2 bg-white text-gray-800 rounded-md shadow-lg border">
            <li>
              <Link href="/profile" className="block p-2 hover:bg-gray-100 rounded">Profile</Link>
            </li>
            <li>
              <Link href="/UNTEvents" className="block p-2 hover:bg-gray-100 rounded">Events</Link>
            </li>
            <li>
              <Link href="/" className="block p-2 hover:bg-gray-100 rounded">Map</Link>
            </li>
            <li>
              <Link href="/about" className="block p-2 hover:bg-gray-100 rounded">About</Link>
            </li>
            <li>
              <LogoutButton/>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
