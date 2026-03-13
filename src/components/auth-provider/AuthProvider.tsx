/* ---------------------------------------------------------------
 * SessionProvider wrapper (client component).
 * Rule 8: max 4 functions — 1 here.
 * --------------------------------------------------------------- */

"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props): JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
