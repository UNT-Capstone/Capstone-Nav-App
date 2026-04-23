import { requireAuth } from "@/src/lib/auth-utils";
import FriendsClientPage from "./FriendsClient";

export default async function FriendsPage() {
  await requireAuth();

  return <FriendsClientPage />;
}
