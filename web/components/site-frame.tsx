"use client";

import { SessionProvider } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";

export function SiteFrame({
  children,
  city = "Accra",
  footer = true,
}: {
  children: React.ReactNode;
  city?: string;
  footer?: boolean;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <CommandPalette />
        <SiteHeader initialCity={city} />
        <main id="main" className="flex-1">
          {children}
        </main>
        {footer && <SiteFooter />}
      </div>
    </SessionProvider>
  );
}
