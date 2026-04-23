import { requireAuth } from "@/src/lib/auth-utils";
import UNTEventsPage from "./UNTEventsClient";

export default async function Page() {
  const session = await requireAuth();

  return (
    <UNTEventsPage
      initialUserName={session.user?.name ?? "Mean Green Eagle"}
      currentUserId={session.user?.id ?? ""}
    />
  );
}