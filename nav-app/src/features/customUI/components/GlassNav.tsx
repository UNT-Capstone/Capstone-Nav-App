import Link from 'next/link';
import Image from 'next/image';
import { isAuth } from '@/src/lib/auth-utils';
import { GlassNavProfile } from './GlassNavProfile';

export default async function GlassNavbar() {
  const authenticated = await isAuth();

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
        
        {/* Right: Auth conditional rendering */}
        <div className="flex items-center gap-8">
          {authenticated ? (
            <GlassNavProfile />
          ) : (
            <>
              <Link href="/login">
                <button className="flex items-center gap-3 px-6 py-2.5 rounded-full 
                                 bg-white/30 hover:bg-white/50 border border-white/50
                                 backdrop-blur-xl transition-all active:scale-90 shadow-md text-base font-bold text-gray-800">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="flex items-center gap-3 px-6 py-2.5 rounded-full 
                                 bg-white/30 hover:bg-white/50 border border-white/50
                                 backdrop-blur-xl transition-all active:scale-90 shadow-md text-base font-bold text-gray-800">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
