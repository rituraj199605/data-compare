/* ---------------------------------------------------------------
 * Dashboard layout — auth guard + header bar.
 * --------------------------------------------------------------- */

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import { GitCompareArrows, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || session === null) {
    router.push("/");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <GitCompareArrows className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm tracking-tight">DataCompare</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{session.user?.email ?? ""}</span>
            <Button variant="ghost" size="sm" onClick={() => void signOut({ callbackUrl: "/" })} className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
