import Image from "next/image";
import Link from "next/link";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { FaUserCircle, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { isAuth } from "@/src/lib/auth-utils";
import { LogoutButton } from "@/src/features/auth/components/logout-button";

// ----------------- CONDITIONAL ELEMENTS -----------------
const ConditionalElements = ({ authenticated }: { authenticated: boolean }) => {
  if (!authenticated) {
    return (
      <div className="flex items-center gap-6">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
<<<<<<< HEAD
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-[#00853E]">Login</Link>
=======
            <Link href="/login" className="px-3 hover:text-green-200 transition-colors">Login</Link>
>>>>>>> 998dea7483912e7b51c5e9e10bb7dafc43b7754b
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
<<<<<<< HEAD
            <Link href="/signup" className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
              Join
            </Link>
=======
            <Link href="/signup" className="px-3 hover:text-green-200 transition-colors">Signup</Link>
>>>>>>> 998dea7483912e7b51c5e9e10bb7dafc43b7754b
          </NavigationMenuLink>
        </NavigationMenuItem>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="flex items-center gap-2">
      {/* CALENDAR BUTTON - Simplified to standard Link for faster client-side transition */}
      <NavigationMenuItem>
        <Link 
          href="/calendar" 
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-[#00853E] transition-all rounded-full hover:bg-green-50"
        >
          <FaCalendarAlt size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Schedule</span>
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem className="hidden md:block">
        <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 p-1 rounded-full transition-all border border-transparent hover:border-gray-200">
          <FaUserCircle size={28} className="text-[#00853E]" />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="flex flex-col w-[150px] p-2 bg-white rounded-2xl shadow-2xl border border-gray-50 mt-2">
            <li className="p-1">
              <NavigationMenuLink asChild>
                <Link href="/profile" className="flex items-center w-full p-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                  Profile Settings
                </Link>
              </NavigationMenuLink>
            </li>
            <li className="p-1 border-t border-gray-100 mt-1">
              <LogoutButton/>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </div>
=======
    <NavigationMenuItem className="hidden md:block">
      <NavigationMenuTrigger className="bg-green-700 hover:bg-green-800 transition-colors">
        <FaUserCircle size={32} className="text-white" />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[120px] gap-2 p-2 bg-white text-black rounded-md shadow-lg border">
          <li>
            <NavigationMenuLink asChild>
              <Link href="/profile" className="block p-2 hover:bg-gray-100 rounded transition-colors">Profile</Link>
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
      </NavigationMenuContent>
    </NavigationMenuItem>
>>>>>>> 998dea7483912e7b51c5e9e10bb7dafc43b7754b
  );
}

// ----------------- NAV-APP LOGO -----------------
const NavLogo = ({ authenticated }: { authenticated: boolean }) => {
  const href = authenticated ? "/home" : "/";
  return (
    <NavigationMenuLink asChild>
<<<<<<< HEAD
      <Link href={href} className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-[#00853E] rounded-lg flex items-center justify-center text-white group-hover:bg-black transition-colors duration-300">
           <FaMapMarkedAlt size={16} />
        </div>
        <span className="text-lg font-black tracking-tighter text-gray-900">NAVIGATOR</span>
      </Link>
    </NavigationMenuLink>
  )
=======
      <Link href={href} aria-label="Go to home" className="flex items-center h-full">
        <Image
          src="/navLogo.png" 
          alt="Nav-App for UNT Home"
          width={160} 
          height={48} 
          priority
          className="h-12 w-auto object-contain transition-all duration-200 hover:opacity-85 active:scale-95"
          style={{ cursor: "pointer" }}
        />
      </Link>
    </NavigationMenuLink>
  );
>>>>>>> 998dea7483912e7b51c5e9e10bb7dafc43b7754b
}

// ----------------- NAVBAR COMPONENT -----------------
const NavBar = async () => {
  const authenticated = await isAuth();

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-[2000] w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav className="h-20 max-w-7xl mx-auto flex items-center justify-between px-8">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <ConditionalRedirect authenticated={authenticated} />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <ConditionalElements authenticated={authenticated} />
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
=======
    <nav className="sticky top-0 z-50 h-12 w-full bg-green-700 text-white flex items-center justify-between pr-5 shadow-lg overflow-hidden">
      
      {/* LEFT: Logo / Home */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavLogo authenticated={authenticated} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* RIGHT: Main Links & Auth */}
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/events" className="px-3 hover:text-green-200 transition-colors font-medium">Events</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/about" className="px-3 hover:text-green-200 transition-colors font-medium">About</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <ConditionalElements authenticated={authenticated} />
        </NavigationMenuList>
      </NavigationMenu>

    </nav>
>>>>>>> 998dea7483912e7b51c5e9e10bb7dafc43b7754b
  );
}

export default NavBar;