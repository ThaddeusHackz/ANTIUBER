"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark, Avatar } from "@/components/wordmark";
import { CityPicker } from "@/components/city-picker";
import { LanguageModal } from "@/components/language-modal";
import {
  ChevronDown,
  Close,
  Globe,
  Menu,
  Help as HelpIcon,
  Star,
  Receipt,
  Card,
  Logout,
  User as UserIcon,
  Car,
} from "@/components/icons";
import { HEADER_NAV, MEGA_MENUS, ABOUT_MENU } from "@/lib/content";
import { useSession } from "@/lib/session";

export function SiteHeader({ initialCity = "Accra" }: { initialCity?: string }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [city, setCity] = useState(initialCity);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setAccountOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, openMenu]);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const active = openMenu ? MEGA_MENUS[openMenu] : null;

  return (
    <>
      <header
        className={`sticky top-0 z-[60] bg-white transition-shadow duration-200 ${
          scrolled || openMenu ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <div className="shell flex h-16 items-center gap-1">
          <Wordmark className="mr-5 shrink-0" />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {HEADER_NAV.map((item) => (
              <button
                key={item.label}
                onMouseEnter={() => enter(item.label)}
                onFocus={() => enter(item.label)}
                onClick={() => enter(item.label)}
                aria-expanded={openMenu === item.label}
                className={`flex h-10 items-center gap-1 rounded-full px-3.5 text-[15px] font-medium transition-colors hover:bg-black/[.05] ${
                  openMenu === item.label ? "bg-black/[.05]" : ""
                }`}
              >
                {item.label}
                <ChevronDown
                  width={15}
                  height={15}
                  className={`transition-transform ${
                    openMenu === item.label ? "rotate-180" : ""
                  }`}
                />
              </button>
            ))}
            <button
              onMouseEnter={() => enter("About")}
              onFocus={() => enter("About")}
              onClick={() => enter("About")}
              aria-expanded={openMenu === "About"}
              className={`flex h-10 items-center gap-1 rounded-full px-3.5 text-[15px] font-medium transition-colors hover:bg-black/[.05] ${
                openMenu === "About" ? "bg-black/[.05]" : ""
              }`}
            >
              About
              <ChevronDown
                width={15}
                height={15}
                className={`transition-transform ${
                  openMenu === "About" ? "rotate-180" : ""
                }`}
              />
            </button>
            <Link
              href="/help"
              className="flex h-10 items-center rounded-full px-3.5 text-[15px] font-medium hover:bg-black/[.05]"
            >
              Help
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => router.push("/ride")}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[14px] font-medium hover:bg-black/[.05] sm:flex"
            >
              <span className="flex items-center gap-1 text-[13px]">
                <span className="h-1.5 w-1.5 rounded-full bg-good" />
                {city}
              </span>
            </button>

            <button
              onClick={() => setLangOpen(true)}
              className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium hover:bg-black/[.05] md:flex"
              aria-label="Select language"
            >
              <Globe width={18} height={18} />
              EN
            </button>

            {user ? (
              <div className="relative flex items-center gap-1" ref={accountRef}>
                <Link
                  href="/ride"
                  className="hidden h-10 items-center rounded-full px-3 text-[14px] font-medium hover:bg-black/[.05] sm:flex"
                >
                  Ride
                </Link>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex h-10 items-center gap-2 rounded-full pl-1 pr-2.5 hover:bg-black/[.05]"
                  aria-expanded={accountOpen}
                  aria-label="Account menu"
                >
                  <Avatar name={profile?.full_name ?? "Rider"} size={32} href="/account" />
                  <ChevronDown width={15} height={15} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-[52px] w-[268px] overflow-hidden rounded-xl border border-hair bg-white py-2 shadow-menu animate-fade-up">
                    <div className="px-4 pb-3 pt-2">
                      <p className="truncate text-[15px] font-semibold">
                        {profile?.full_name ?? "Rider"}
                      </p>
                      <p className="truncate text-[13px] text-muted">
                        {profile?.email ?? user.email}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-[13px] text-muted">
                        <Star width={13} height={13} className="text-black" />
                        {profile?.rating?.toFixed(2) ?? "4.92"} rider rating
                      </p>
                    </div>
                    <div className="divider" />
                    <div className="py-1">
                      <MenuLink href="/ride" icon={<Car width={18} height={18} />} label="Book a ride" />
                      <MenuLink href="/activity" icon={<Receipt width={18} height={18} />} label="Activity" />
                      <MenuLink href="/payments" icon={<Card width={18} height={18} />} label="Wallet & payments" />
                      <MenuLink href="/account" icon={<UserIcon width={18} height={18} />} label="Manage account" />
                      <MenuLink href="/help" icon={<HelpIcon width={18} height={18} />} label="Help" />
                    </div>
                    <div className="divider" />
                    <button
                      onClick={async () => {
                        await signOut();
                        setAccountOpen(false);
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] hover:bg-surface"
                    >
                      <Logout width={18} height={18} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center rounded-full px-4 text-[14px] font-medium hover:bg-black/[.05] sm:flex"
                >
                  Log in
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <span className="btn btn-primary btn-sm">Sign up</span>
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/[.05] lg:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Desktop mega menu */}
        {active && (
          <div
            onMouseEnter={() => enter(active.label)}
            onMouseLeave={leave}
            className="absolute inset-x-0 top-16 hidden border-t border-hair bg-white shadow-menu lg:block"
          >
            <div className="shell grid grid-cols-12 gap-8 py-8">
              <div className="col-span-8 grid grid-cols-2 gap-8">
                {active.columns.map((col) => (
                  <div key={col.title}>
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[.1em] text-subtle">
                      {col.title}
                    </p>
                    <ul className="space-y-1">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link
                            href={l.href}
                            className="block rounded-md py-1.5 text-[16px] tracking-[-0.01em] hover:underline"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {active.promo && (
                <div className="col-span-4">
                  <Link
                    href={active.promo.href}
                    className="group flex h-full flex-col justify-between rounded-lg bg-surface p-6 transition-colors hover:bg-[#ededed]"
                  >
                    <div>
                      <p className="text-[20px] font-semibold leading-snug tracking-[-0.02em]">
                        {active.promo.title}
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">
                        {active.promo.body}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium underline underline-offset-4">
                      {active.promo.cta}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {openMenu === "About" && (
          <div
            onMouseEnter={() => enter("About")}
            onMouseLeave={leave}
            className="absolute inset-x-0 top-16 hidden border-t border-hair bg-white shadow-menu lg:block"
          >
            <div className="shell grid grid-cols-3 gap-8 py-8">
              {ABOUT_MENU.map((col) => (
                <div key={col.title}>
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-[.1em] text-subtle">
                    {col.title}
                  </p>
                  <ul className="space-y-1">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="block rounded-md py-1.5 text-[16px] hover:underline"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-lg bg-surface p-6">
                <p className="text-[20px] font-semibold tracking-[-0.02em]">
                  It&apos;s easier in the apps
                </p>
                <p className="mt-2 text-[14px] text-muted">
                  Download the Uber app to request a ride, reserve ahead and track
                  your driver from your phone.
                </p>
                <Link href="/ride" className="btn btn-primary mt-5 w-full">
                  Get the app
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white animate-sheet-up">
            <div className="flex h-16 items-center justify-between px-5">
              <Wordmark />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/[.06]"
              >
                <Close />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              <div className="mt-2 space-y-1">
                {HEADER_NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg px-3 py-3.5 text-[19px] font-medium hover:bg-surface"
                  >
                    {item.label}
                    <ChevronDown width={18} height={18} className="-rotate-90" />
                  </Link>
                ))}
                <Link
                  href="/help"
                  className="flex items-center justify-between rounded-lg px-3 py-3.5 text-[19px] font-medium hover:bg-surface"
                >
                  Help
                  <ChevronDown width={18} height={18} className="-rotate-90" />
                </Link>
              </div>

              <div className="mt-6 rounded-lg bg-surface p-4">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setCityOpen(true);
                  }}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span>
                    <span className="block text-[13px] text-muted">City</span>
                    <span className="text-[15px] font-medium">{city}, GH</span>
                  </span>
                  <span className="text-[14px] underline underline-offset-4">Change</span>
                </button>
              </div>

              <div className="mt-6 space-y-2">
                {user ? (
                  <>
                    <Link href="/ride" className="btn btn-primary w-full">
                      Book a ride
                    </Link>
                    <Link href="/activity" className="btn btn-secondary w-full">
                      Activity
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut();
                        setMobileOpen(false);
                        router.push("/");
                      }}
                      className="btn btn-ghost w-full"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-primary w-full">
                      Log in
                    </Link>
                    <Link href="/signup" className="btn btn-secondary w-full">
                      Sign up
                    </Link>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setLangOpen(true);
                }}
                className="mt-6 flex items-center gap-2 px-1 text-[14px] text-muted"
              >
                <Globe width={16} height={16} /> English
              </button>
            </div>
          </div>
        </div>
      )}

      <CityPicker
        open={cityOpen}
        city={city}
        onClose={() => setCityOpen(false)}
        onSelect={(c) => setCity(c)}
      />
      <LanguageModal open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-surface"
    >
      {icon}
      {label}
    </Link>
  );
}
