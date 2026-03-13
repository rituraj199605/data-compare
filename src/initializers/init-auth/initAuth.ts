/* ---------------------------------------------------------------
 * NextAuth configuration.
 * Rule 11: initializers in their own folder.
 * Rule 8: max 4 functions per file — this exports 1 config object.
 * --------------------------------------------------------------- */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

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
          const emailMatch: boolean =
            credentials.email === adminEmail;
          if (!emailMatch) {
            return null;
          }
          const passOk: boolean = await compare(
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
    session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
    pages: { signIn: "/" },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return options;
}
