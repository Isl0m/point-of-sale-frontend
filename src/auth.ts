import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { fetcher } from "./lib/axios";

export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type DbUser = {
  id: string;
  fullName: string;
  username: string;
  password: string;
  role: "MANAGER" | "ADMIN" | "STAFF";
};

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username: User["username"];
      role: User["role"];
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const data = await userSchema.parseAsync(credentials);
          const response = (await fetcher.post("/api/user/login", data)).data;
          const user = response.data as DbUser | null;
          if (!user) return null;
          console.log("user", user);
          return {
            name: user.fullName,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("Error parsing user credentials:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          role: token.role,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        //@ts-ignore
        token.username = user.username;
        //@ts-ignore
        token.role = user.role;
      }
      return token;
    },
  },
});
