"use client";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export const LogoutButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // This is necessary for the Nav Bar to update properly
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          // Rerender the server components
          router.refresh();
        },
      },
    });
  };

  return (
    <a 
      href='/' 
      onClick={handleLogout}
      className={className}
    >
      Logout
    </a>
  )
}