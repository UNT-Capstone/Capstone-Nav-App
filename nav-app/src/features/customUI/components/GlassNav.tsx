'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { LogoutButton } from '../../auth/components/logout-button';
import { useState, useRef, useEffect } from 'react';

export default function GlassNavbar() {
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
    <div className="flex justify-center w-full pt-6 px-4 sticky top-0 z-50">
      <header className="w-full max-w-6xl px-8 py-5 
                        bg-white/45 backdrop-blur-lg backdrop-saturate-150 
                        border border-white/40 rounded-[2rem] shadow-xl 
                        flex justify-between items-center">
        
        {/* Left: Home Button with Larger Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 transition-all group-hover:scale-110 group-active:scale-95">
              {/* Increased size from 32 to 44 */}
              <Image 
                src="/navLogo.png" 
                alt="Nav-App Logo" 
                width={44} 
                height={44}
                className="object-contain"
                priority // Ensures logo loads immediately
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-[#00853E] hidden sm:block leading-none">
                UNT Navigator
              </h1>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block mt-1 ml-0.5">
                Campus Guide
              </span>
            </div>
          </Link>
        </div>
        
        {/* Right: Profile with click-outside-aware dropdown containing Events/About */}
        <div className="flex items-center gap-8">
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
                    <Link href="/about" className="block p-2 hover:bg-gray-100 rounded">About</Link>
                  </li>
                  <li>
                    <LogoutButton/>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
