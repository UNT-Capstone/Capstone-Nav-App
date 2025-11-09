"use client";

import { useTRPC } from "@/src/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
  const trpc = useTRPC();
  const {data:users} = useSuspenseQuery(trpc.getUsers.queryOptions()); 
  return (
    <div>
      Client Component: {JSON.stringify(users)}
    </div>
  )
}