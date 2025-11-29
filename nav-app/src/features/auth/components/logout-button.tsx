"use client";
import { authClient } from "@/src/lib/auth-client";

export const LogoutButton = ({ className }: { className?: string }) => {
  return (
    <a 
      href='/' 
      onClick={() => authClient.signOut()}
      className={className}
    >
      Logout
    </a>
  )
}