import { auth } from "@/src/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

const { POST, GET } = toNextJsHandler(auth);

export { POST, GET };

export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
