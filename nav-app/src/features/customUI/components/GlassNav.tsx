import Link from "next/link";
import Image from "next/image";
import { isAuth } from "@/src/lib/auth-utils";
import { GlassNavProfile } from "./GlassNavProfile";

export default async function GlassNavbar() {
  const authenticated = await isAuth();

  return (
    <div className="flex justify-center w-full pt-3 px-3 fixed top-0 left-0 right-0 z-[2000]">
      
      <header
        className="
          w-full max-w-6xl
          px-5 py-3
          bg-white/40
          backdrop-blur-xl
          backdrop-saturate-150
          border border-white/30
          rounded-2xl
          shadow-lg
          flex justify-between items-center
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">

            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 group-hover:scale-105 transition">
              <Image
                src="/navLogo.png"
                alt="Nav-App Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col leading-tight">
              <h1 className="text-lg font-bold text-[#00853E] hidden sm:block">
                UNT Navigator
              </h1>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest hidden sm:block">
                Campus Guide
              </span>
            </div>

          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {authenticated ? (
            <GlassNavProfile />
          ) : (
            <>
              <Link href="/login">
                <button className="
                  px-4 py-2
                  rounded-full
                  bg-white/30 hover:bg-white/50
                  border border-white/40
                  backdrop-blur-xl
                  transition
                  active:scale-95
                  shadow-sm
                  text-sm font-semibold text-gray-800
                ">
                  Login
                </button>
              </Link>

              <Link href="/signup">
                <button className="
                  px-4 py-2
                  rounded-full
                  bg-white/30 hover:bg-white/50
                  border border-white/40
                  backdrop-blur-xl
                  transition
                  active:scale-95
                  shadow-sm
                  text-sm font-semibold text-gray-800
                ">
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