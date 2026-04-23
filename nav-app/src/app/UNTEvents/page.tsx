import { requireAuth } from "@/src/lib/auth-utils"; 
import UNTEventsPage from "./UNTEventsClient"; // Adjusted name

export default async function Page() {
  // 1. Ensure the user is logged in
  const session = await requireAuth();

  // 2. Pass the user name (with a fallback) to the client component
  return (
    <UNTEventsPage 
      initialUserName={session.user?.name ?? "Mean Green Eagle"} 
      currentUserId={session.user?.id ?? ""}
    />
  );
}