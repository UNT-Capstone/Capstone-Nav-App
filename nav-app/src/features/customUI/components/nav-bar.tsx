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
import { FaUserCircle } from 'react-icons/fa';
import { isAuth } from "@/src/lib/auth-utils";
import { LogoutButton } from "@/src/features/auth/components/logout-button";

// ----------------- CONDITIONAL ELEMENTS -----------------
const ConditionalElements = ({ authenticated }: { authenticated: boolean }) => {
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
  );
}

// ----------------- NAV-APP LOGO -----------------
const NavLogo = ({ authenticated }: { authenticated: boolean }) => {
  const href = authenticated ? "/home" : "/";
  return (
    <NavigationMenuLink asChild>
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
}

// ----------------- NAVBAR COMPONENT -----------------
const NavBar = async () => {
  const authenticated = await isAuth();

  return (
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
  );
}

export default NavBar;