import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuTrigger ,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { FaUserCircle } from 'react-icons/fa';
import { isAuth } from "@/src/lib/auth-utils";
import { LogoutButton } from "@/src/features/auth/components/logout-button";
import Link from "next/link";

const ConditionalElements = ({ authenticated } : {authenticated:boolean}) => {
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

const ConditionalRedirect = ({ authenticated } : {authenticated:boolean}) => {
  const href = authenticated ? "/home" : "/";
  return (
    <NavigationMenuLink asChild>
      <Link href={href}>
        Nav-App
      </Link>
    </NavigationMenuLink>
  )

}

const NavBar = async () => {
  const authenticated = await isAuth();

  return (
    <nav className="h-12 w-full mt-1 bg-green-700 text-white flex items-center justify-between px-5">
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
  );
}

export default NavBar;