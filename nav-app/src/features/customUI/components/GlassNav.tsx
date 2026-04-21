import Link from 'next/link';
import Image from 'next/image';
import { isAuth } from '@/src/lib/auth-utils';
import { GlassNavProfile } from './GlassNavProfile'; // Correct sibling path

/**
 * GlassNavbar Component
 * * A high-fidelity, translucent navigation bar for the UNT Navigator application.
 * Features conditional rendering for authenticated users, including a custom
 * Schedule link and profile management.
 * * @returns {JSX.Element} The rendered navigation header.
 */
export default async function GlassNavbar() {
  const authenticated = await isAuth();

  return (
    <div className="flex justify-center w-full pt-6 px-4 fixed top-0 left-0 right-0 z-[2000]">
      <header className="w-full max-w-6xl px-8 py-5 
                        bg-white/45 backdrop-blur-lg backdrop-saturate-150 
                        border border-white/40 rounded-[2rem] shadow-xl 
                        flex justify-between items-center">
        
        {/* Left: Home Button */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 transition-all group-hover:scale-110">
              <Image src="/navLogo.png" alt="Logo" width={44} height={44} className="object-contain" priority />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-2xl font-black text-[#00853E] hidden sm:block leading-none">UNT Navigator</h1>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block mt-1">Campus Guide</span>
            </div>
          </Link>
        </div>
        
        {/* Right: Auth conditional rendering */}
        <div className="flex items-center gap-8">
          {authenticated ? (
            <div className="flex items-center gap-6">
              <GlassNavProfile />
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <button className="px-6 py-2.5 rounded-full bg-white/30 border border-white/50 font-bold text-gray-800">Login</button>
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}