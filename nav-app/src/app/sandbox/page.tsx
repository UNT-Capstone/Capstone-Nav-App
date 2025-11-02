import { Button } from "@/src/components/ui/button";
import prisma from "@/src/lib/prisma";
import { json } from "better-auth";

const Page = async () => {
  const users = await prisma.user.findMany();
  return (
    <>
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Button variant={"outline"}>Hello</Button>
        {JSON.stringify(users)}
      </div>
    </>
  );

}

export default Page;
