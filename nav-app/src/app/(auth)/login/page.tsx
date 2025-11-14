import LoginForm from "@/src/features/auth/components/login-form";
import { requireUnauth } from "@/src/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return(
    <>
      <LoginForm/>
    </>
  );
};

export default Page;