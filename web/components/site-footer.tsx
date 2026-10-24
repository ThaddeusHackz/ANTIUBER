"use client";

import Link from "next/link";
import { useState } from "react";
import { FOOTER_COLUMNS } from "@/lib/content";
import { Globe, AppleLogo, PlayLogo } from "@/components/icons";
import { Wordmark } from "@/components/wordmark";
import { LanguageModal } from "@/components/language-modal";

export function SiteFooter() {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <footer className="on-dark mt-24 bg-black text-white">
      <div className="shell py-14">
        <div className="flex flex-col gap-10 border-b border-white/15 pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark className="text-white [&>span:last-child]:bg-white" href="/" />
            <p className="mt-4 max-w-[320px] text-[14px] leading-relaxed text-white/60">
              Go anywhere with Uber. Request a ride, hop in, and go — across Accra,
              Kumasi and Sekondi-Takoradi.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => setLangOpen(true)}
              className="flex h-11 items-center gap-2 rounded-lg border border-white/25 px-4 text-[14px] font-medium transition-colors hover:bg-white/10"
            >
              <Globe width={18} height={18} />
              English (Ghana)
            </button>
            <Link
              href="/ride"
              className="flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-[14px] font-medium text-black transition-opacity hover:opacity-90"
            >
              <AppleLogo width={17} height={17} />
              App Store
            </Link>
            <a
              href="#"
              className="flex h-11 items-center gap-2 rounded-lg border border-white/25 px-4 text-[14px] font-medium transition-colors hover:bg-white/10"
            >
              <PlayLogo width={16} height={16} />
              Google Play
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[13px] font-semibold uppercase tracking-[.1em] text-white/45">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-white/80 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/15 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-white/60">
            <span>© 2026 Uber Technologies Inc.</span>
            <Link href="/legal/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/legal/accessibility" className="hover:text-white">
              Accessibility
            </Link>
            <Link href="/legal/terms" className="hover:text-white">
              Terms
            </Link>
            <span className="ml-auto flex items-center gap-4">
              <a href="#" aria-label="X" className="hover:text-white">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.9l-4.3-6.3L6.6 22H3.5l7.1-8.1L2 2h6.9l4 5.9L18.9 2zm-1.2 18h1.7L7.4 3.8H5.6L17.7 20z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 002.4 7.2C2 9 2 12 2 12s0 3 .4 4.8a2.7 2.7 0 001.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 001.9-1.9C22 15 22 12 22 12s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-white/40">
            Reverse-engineered demonstration build. Not affiliated with, endorsed by,
            or operated by Uber Technologies Inc. All trademarks belong to their
            respective owners.
          </p>
        </div>
      </div>
      <LanguageModal open={langOpen} onClose={() => setLangOpen(false)} />
    </footer>
  );
}
