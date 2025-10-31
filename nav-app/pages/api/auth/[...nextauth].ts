import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo user validation
        if (
          credentials?.username === "alice" &&
          credentials?.password === "password123"
        ) {
          return { id: 1, name: "Alice" }; // object returned becomes the session user
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
