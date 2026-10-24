"use client";

import Link from "next/link";
import { useSession } from "@/lib/session";

export function RiderGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 text-[14px] text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          Loading your account…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5">
        <div className="w-full max-w-[420px] rounded-xl2 border border-hair p-8 text-center">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
            Sign in to continue
          </h1>
          <p className="mt-2 text-[14px] text-muted">
            This page is part of your rider account.
          </p>
          <Link href="/login" className="btn btn-primary mt-6 w-full">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-secondary mt-2 w-full">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
