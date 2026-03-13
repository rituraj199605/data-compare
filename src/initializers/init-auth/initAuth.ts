/* ---------------------------------------------------------------
 * NextAuth configuration.
 * Rule 11: initializers in their own folder.
 * Rule 8: max 4 functions per file — this exports 1 config object.
 * Uses Node built-in crypto (no bcryptjs dependency).
 * --------------------------------------------------------------- */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { scryptSync } from "crypto";

/** Verify a password against a salt:hash string. */
function verifyPassword(password: string, stored: string): boolean {
  const parts: string[] = stored.split(":");
  const salt: string | undefined = parts[0];
  const hash: string | undefined = parts[1];
  if (salt === undefined || hash === undefined) {
    return false;
  }
  const derived: string = scryptSync(password, salt, 64).toString("hex");
  return derived === hash;
}

/** Build the NextAuth options object. */
export function buildAuthOptions(): NextAuthOptions {
  const adminEmail: string = process.env.ADMIN_EMAIL ?? "";
  const adminHash: string = process.env.ADMIN_PASSWORD_HASH ?? "";

  const options: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) {
            return null;
          }
          if (credentials.email !== adminEmail) {
            return null;
          }
          const passOk: boolean = verifyPassword(
            credentials.password,
            adminHash
          );
          if (!passOk) {
            return null;
          }
          return { id: "1", email: credentials.email };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.email = token.email as string;
        }
        return session;
      },
    },
    session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
    pages: { signIn: "/" },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return options;
}
