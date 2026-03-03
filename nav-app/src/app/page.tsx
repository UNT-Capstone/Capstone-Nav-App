import LandingPage from "../features/customUI/components/landing-animation";
import UNTLiveMap from "@/src/features/map/components/UNTLiveMap";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export default async function Page() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session) {
    return <LandingPage />;
  }


  return (
    <div className="w-screen h-screen overflow-hidden">
      <UNTLiveMap />
    </div>
  );
}