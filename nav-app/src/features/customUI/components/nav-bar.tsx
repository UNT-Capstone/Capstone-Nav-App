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
import { FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { isAuth } from "@/src/lib/auth-utils";
import { LogoutButton } from "@/src/features/auth/components/logout-button";

const ConditionalElements = ({ authenticated }: { authenticated: boolean }) => {
  if (!authenticated) {
    return (
      <div className="flex items-center gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/login" className="text-xs font-black uppercase tracking-widest hover:text-green-200 transition-colors">Login</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/signup" className="bg-white text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-green-50 transition-all active:scale-95">
              Join
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* LEARNING TIP: Using a standard Link here instead of NavigationMenuLink 
          prevents the "Redirect/New Tab" bug we fixed earlier.
      */}
      <NavigationMenuItem>
        <Link 
          href="/calendar" 
          className="flex items-center gap-2 px-3 py-1 hover:bg-green-800 rounded-lg transition-all group"
        >
          <FaCalendarAlt size={14} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent hover:bg-green-800 transition-colors p-1 rounded-full border border-transparent hover:border-green-600">
          <FaUserCircle size={24} className="text-white" />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="flex flex-col w-[160px] p-2 bg-white rounded-2xl shadow-2xl border border-gray-100 mt-2">
            <li className="p-1">
              <NavigationMenuLink asChild>
                <Link href="/profile" className="flex items-center w-full p-2 text-[11px] font-black uppercase tracking-tight text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all">
                  My Profile
                </Link>
              </NavigationMenuLink>
            </li>
            <div className="h-[1px] bg-gray-50 my-1 mx-2" />
            <li className="p-1">
              <LogoutButton />
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </div>
  );
}

const NavBar = async () => {
  const authenticated = await isAuth();

  return (
    // header: Sticky ensures it stays visible, backdrop-blur adds a premium feel
    <header className="sticky top-0 z-[2000] w-full bg-green-700/95 backdrop-blur-md shadow-lg border-b border-green-800">
      <nav className="h-14 max-w-7xl mx-auto flex items-center justify-between px-6">
        
        {/* LEFT: Branding */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={authenticated ? "/home" : "/"} className="flex items-center transition-transform hover:scale-105 active:scale-95">
                  <Image
                    src="/navLogo.png" 
                    alt="Logo"
                    width={140} 
                    height={35} 
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* RIGHT: Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/events" className="px-3 text-[10px] font-black uppercase tracking-widest hover:text-green-200 transition-colors">Events</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <ConditionalElements authenticated={authenticated} />
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
}

export default NavBar;