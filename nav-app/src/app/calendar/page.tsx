import { requireAuth } from "@/src/lib/auth-utils";
import CalendarClientPage from "./CalendarClient";

/**
 * Options for the custom Day Picker UI. 
 * Values match the shorthand used in the formatted time string.
 */
export default async function CalendarPage() {
  await requireAuth();

  return <CalendarClientPage />;
}
