/* ---------------------------------------------------------------
 * NextAuth catch-all route.
 * Rule 8: max 4 functions — this file has 1 export.
 * --------------------------------------------------------------- */

import NextAuth from "next-auth";
import { buildAuthOptions } from "@/initializers/init-auth/initAuth";

const authOptions = buildAuthOptions();
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
