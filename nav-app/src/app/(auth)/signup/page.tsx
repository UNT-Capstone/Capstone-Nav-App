import SignupForm from "@/src/features/auth/components/sign-up-form";
import { requireUnauth } from "@/src/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return(
    <>
      <SignupForm/>
    </>
  );
};

export default Page;