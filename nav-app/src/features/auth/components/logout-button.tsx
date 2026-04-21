"use client";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export const LogoutButton = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();
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
      className="block px-4 py-2 hover:bg-gray-200/70 active:bg-gray-300/80 rounded-lg transition-all duration-200 font-medium text-gray-700 hover:text-gray-900"
    >
      Logout
    </a>
  )
}
