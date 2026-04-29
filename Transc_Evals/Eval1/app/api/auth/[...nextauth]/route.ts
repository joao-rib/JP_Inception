/**
 * NextAuth configuration for credentials login.
 *
 * This file:
 * 1. Validates email/password credentials against the Account table.
 * 2. Stores JWT session data in HTTP-only cookies.
 * 3. Exposes custom session fields for the frontend.
 */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";

// Extend the NextAuth session so the frontend can read session.user.id.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
const ACTIVE_SESSION_WINDOW_MS = 25_000;

/**
 * NextAuth Configuration
 *
 * This configures authentication with:
 * - Credentials Provider: Email/password authentication
 * - Prisma Adapter: Syncs sessions/tokens with database
 * - Callbacks: Customizes session and JWT tokens
 */
const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      // Provider label shown in the sign-in flow.
      name: "Credentials",
      // Credentials requested from the sign-in form.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      /**
       * Validates credentials against the database.
       *
       * This function:
       * 1. Finds the account by email.
       * 2. Compares the password hash.
       * 3. Returns the user object expected by NextAuth.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Look up the account by email.
        const account = await prisma.account.findUnique({
          where: { email: credentials.email },
        });

        if (!account || !account.passwordHash) {
          return null;
        }

        // Compare the provided password with the stored hash.
        const isPasswordValid = await compare(credentials.password, account.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        const recentlyOnline =
          account.onlineStatus === "ONLINE" &&
          Date.now() - new Date(account.updatedAt).getTime() < ACTIVE_SESSION_WINDOW_MS;

        if (recentlyOnline) {
          console.warn(
            "[NextAuth] Blocked login for account still active in another browser:",
            account.id,
          );
          throw new Error("AccountActiveSession");
        }

        // Mark the account online as soon as the credentials are validated.
        void prisma.account
          .update({
            where: { id: account.id },
            data: { onlineStatus: "ONLINE" },
          })
          .catch((error: unknown) => {
            console.error("[NextAuth] Failed to update online status:", error);
          });

        // Return the user object expected by NextAuth.
        return {
          id: account.id,
          email: account.email,
          name: account.username,
          image: account.avatarUrl,
        };
      },
    }),
  ],
  /**
   * Session strategy: JWT tokens stored in HTTP-only cookies.
   */
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  /**
   * JWT callback used to persist custom claims in the token.
   */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    /**
     * Session callback used to expose custom fields to the client.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: authSecret,
  events: {
    async signOut({ token }: { token?: JWT | null }) {
      const accountId = token?.id;

      if (!accountId) {
        return;
      }

      try {
        await prisma.account.update({
          where: { id: accountId },
          data: { onlineStatus: "OFFLINE" },
        });
      } catch (error) {
        console.error("[NextAuth] Failed to mark account offline on signOut:", error);
      }
    },
  },
};

// Export the handler for both GET and POST requests.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Export the config for reuse in other files, such as middleware.
export default authOptions;
