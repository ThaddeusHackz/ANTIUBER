"use client";

import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function AuthShell({
  children,
  footerNote,
}: {
  children: React.ReactNode;
  footerNote?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex h-16 items-center justify-between px-5 sm:px-8">
        <Wordmark />
        <div className="flex items-center gap-4 text-[14px]">
          <Link href="/help" className="hidden text-muted hover:text-black sm:block">
            Help
          </Link>
          <span className="text-muted">|</span>
          <Link href="/signup" className="font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1200px] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 pb-16 pt-6 sm:px-12 lg:px-16">
          <div className="w-full max-w-[400px]">{children}</div>
          {footerNote && (
            <div className="mt-10 w-full max-w-[400px]">{footerNote}</div>
          )}
          <p className="mt-10 max-w-[400px] text-[12px] leading-relaxed text-subtle">
            By proceeding, you consent to receive calls, SMS or emails from us at the
            number provided, including by automated means. Reverse-engineered demo —
            not affiliated with Uber Technologies Inc.
          </p>
        </div>

        <div className="relative hidden items-center justify-center bg-black lg:flex">
          <div className="text-center text-white">
            <div className="mx-auto grid h-[156px] w-[156px] place-items-center rounded-xl bg-white">
              <QrArt />
            </div>
            <p className="mt-8 text-[26px] font-semibold tracking-[-0.02em]">
              Scan to get the app
            </p>
            <p className="mt-2 text-[14px] text-white/60">
              Use your phone camera to download
              <br />
              the rider app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QrArt() {
  const cells: boolean[] = [];
  for (let i = 0; i < 21 * 21; i++) {
    const x = i % 21;
    const y = Math.floor(i / 21);
    const finder =
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    cells.push(
      finder
        ? x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5)
        : (x * 7 + y * 13) % 5 < 2
    );
  }
  return (
    <div
      className="grid h-[132px] w-[132px] gap-0"
      style={{ gridTemplateColumns: "repeat(21, 1fr)" }}
      aria-hidden
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-black" : "bg-white"} />
      ))}
    </div>
  );
}
