import LandingPage from "../features/customUI/components/landing-animation";
import { requireUnauth } from "../lib/auth-utils";

const page = async () =>{
  await requireUnauth();
  return <LandingPage/>;
}

export default page
