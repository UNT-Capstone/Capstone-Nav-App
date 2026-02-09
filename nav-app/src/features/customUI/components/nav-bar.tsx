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
//import logo from "/public/navLogo.png"; // put your logo in /public

// ----------------- CONDITIONAL ELEMENTS -----------------
const ConditionalElements = ({ authenticated }: { authenticated: boolean }) => {
  if (!authenticated) {
    return (
      <>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/login">Login</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/signup">Signup</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </>
    );
  }

  return (
    <NavigationMenuItem className="hidden md:block">
      <NavigationMenuTrigger className="bg-green-700">
        <FaUserCircle size={32} className="text-white" />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[75px] gap-4">
          <li>
            <NavigationMenuLink asChild>
              <Link href="/profile">Profile</Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <LogoutButton/>
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
      <Link href={href} aria-label="Go to home">
        <Image
          src="/navLogo.png"  // <--- CHANGE THIS TO A STRING
          alt="Nav-App for UNT Home"
          width={140}
          height={40}
          priority
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
    <nav className="h-12 w-full mt-1 bg-green-700 text-white flex items-center justify-between px-5">
      
      {/* LEFT: Logo / Home */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavLogo authenticated={authenticated} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* RIGHT: User / Login / Signup */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/events">Events</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/about">About</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <ConditionalElements authenticated={authenticated} />
        </NavigationMenuList>
      </NavigationMenu>

    </nav>
  );
}

export default NavBar;
