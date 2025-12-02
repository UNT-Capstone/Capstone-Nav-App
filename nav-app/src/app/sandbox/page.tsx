// // Fetching data from the database using TRPC on the client
// // Works but is noticable slow compared to the server side fetching of data
// "use client"
// import { useTRPC } from "@/src/trpc/client";
// import { useQuery } from "@tanstack/react-query";

// const Page = () => {
//   const trpc = useTRPC();
//   const { data : users } = useQuery(trpc.getUsers.queryOptions());
//   return (
//     <>
//       <div className="min-h-screen min-w-screen flex items-center justify-center">
//         {JSON.stringify(users)}
//       </div>
//     </> 
//   );

// }

// export default Page;


// // Fetching data from the database using TRPC on the server side
// import { caller } from "@/src/trpc/server";
// import { json } from "better-auth";

// const Page = async () => {
//   const users = await caller.getUsers();
//   return (
//     <>
//       <div className="min-h-screen min-w-screen flex items-center justify-center">
//         {JSON.stringify(users)}
//       </div>
//     </> 
//   );

// }

// export default Page;

// // Fetching data from the server and displaying it on the client
// // Takes advantage of the speed of the client for fetching the date
// // and passing it to the client to render as a prop 
// import { caller } from "@/src/trpc/server";
// import { Client } from "./test_client";

// const Page = async () =>{
//   const users = await caller.getUsers();

//   return (
//     <div>
//       <Client users={users}/>
//     </div>
//   )
// }

// export default Page;

// Pre fetching the data from the server and displaying it on the client 
// by passing it as a tanstack state. Takes advantage of the server side 
// fetching speed while also allowing the data to be manipulated on the client side.

import { getQueryClient, trpc } from "@/src/trpc/server";
import { Client } from "./test_client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { requireAuth} from "@/src/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>loading....</p>}>
          <Client/>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default Page;