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

const ConditionalElements = ({ authenticated }) => {
  if (!authenticated) {
    return (
      <>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/login">Login</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/signup">Signup</a>
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
              <a href="/profile">Profile</a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <a href="/">Log out</a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

const NavBar = async () => {
  const authenticated = await isAuth();

  return (
    <nav className="h-12 w-full mt-1 bg-green-700 text-white flex items-center justify-between px-5">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/">Nav-App</a>
            </NavigationMenuLink>
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