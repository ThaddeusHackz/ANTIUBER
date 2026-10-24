"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  EXPLORE_TILES,
  HOW_TO_STEPS,
  MORE_WAYS,
  CITIES,
} from "@/lib/content";
import {
  ArrowRight,
  Car,
  Calendar,
  Plane,
  Key,
  Person,
  Sparkle,
  Package,
  ChevronDown,
  Clock,
  Shield,
  Star,
  Plus,
} from "@/components/icons";

export function ReadyToTravel() {
  return (
    <section className="shell mt-16 lg:mt-24">
      <div className="overflow-hidden rounded-lg bg-surface">
        <div className="grid items-center gap-0 md:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <h2 className="h-section">Ready to travel?</h2>
            <p className="mt-3 max-w-[380px] text-[15px] leading-relaxed text-muted">
              Schedule your ride ahead of time and get a reminder when it&apos;s time
              to go. Book up to 90 days in advance.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/reserve" className="btn btn-primary px-6">
                Schedule ahead
              </Link>
              <span className="flex items-center gap-2 text-[13px] text-muted">
                <Clock width={16} height={16} /> Average pickup in Accra: 4 min
              </span>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full md:aspect-[16/11]">
            <Image
              src="/images/hero-travel.jpg"
              alt="A rider being picked up in the city"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TileIcon({ name }: { name: string }) {
  const common = "h-16 w-16";
  switch (name) {
    case "car":
      return <Car className={common} strokeWidth={1.2} />;
    case "calendar":
      return <Calendar className={common} strokeWidth={1.2} />;
    case "plane":
      return <Plane className={common} strokeWidth={1.2} />;
    case "key":
      return <Key className={common} strokeWidth={1.2} />;
    case "teen":
    case "senior":
      return <Person className={common} strokeWidth={1.2} />;
    default:
      return <Sparkle className={common} strokeWidth={1.2} />;
  }
}

export function ExploreTiles() {
  return (
    <section className="shell mt-16 lg:mt-24">
      <h2 className="h-section">Explore what you can do with Uber</h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLORE_TILES.map((tile) => (
          <Link
            key={tile.slug}
            href={tile.href}
            className="group flex flex-col overflow-hidden rounded-lg border border-hair bg-white transition-all duration-200 hover:shadow-card hover:-translate-y-0.5"
          >
            <div className="relative flex aspect-[16/9] items-center justify-center bg-surfaceAlt">
              <span className="text-black/80 transition-transform duration-300 group-hover:scale-105">
                <TileIcon name={tile.icon} />
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[.08em] text-black/60">
                {tile.title}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="h-card">{tile.title}</h3>
              <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-muted">
                {tile.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium underline underline-offset-4">
                Details
                <ArrowRight
                  width={15}
                  height={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="mt-20 bg-surface py-16 lg:mt-24 lg:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="h-section">How to request a ride</h2>
          <Link
            href="/ride"
            className="hidden items-center gap-2 text-[14px] font-medium underline underline-offset-4 sm:flex"
          >
            Request a ride <ArrowRight width={15} height={15} />
          </Link>
        </div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {HOW_TO_STEPS.map((s, i) => (
            <li key={s.n} className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-[12px] font-semibold text-white">
                  {s.n}
                </span>
                {i < HOW_TO_STEPS.length - 1 && (
                  <span className="hidden h-px flex-1 bg-black/15 lg:block" />
                )}
              </div>
              <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CityHub() {
  const [open, setOpen] = useState(false);
  return (
    <section className="shell mt-20 lg:mt-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surfaceAlt">
          <Image
            src="/images/city-hub.jpg"
            alt="Accra at golden hour"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="h-section">Planning your next getaway?</h2>
          <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-muted">
            From weekend road trip to international destination, we&apos;ve got you
            covered. Explore transport options, points of interest, and more with our
            new City Hub.
          </p>

          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-6 flex items-center gap-2 text-[15px] font-medium"
            aria-expanded={open}
          >
            Explore cities
            <span
              className={`grid h-8 w-8 place-items-center rounded-full border border-black/15 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            >
              <ChevronDown width={16} height={16} />
            </span>
          </button>

          {open && (
            <ul className="mt-5 divide-y divide-hair border-y border-hair animate-fade-up">
              {CITIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/cities/${c.slug}`}
                    className="flex items-center justify-between py-3.5 text-[15px] hover:underline"
                  >
                    <span>
                      Getting around {c.name}
                      <span className="ml-2 text-[13px] text-subtle">{c.region}</span>
                    </span>
                    <ArrowRight width={16} height={16} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function MoreWays() {
  return (
    <section className="shell mt-20 lg:mt-24">
      <h2 className="h-section">More ways to use Uber</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {MORE_WAYS.map((w) => (
          <div
            key={w.title}
            className="flex flex-col rounded-lg border border-hair p-7 transition-shadow hover:shadow-card"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-surface">
              {w.icon === "calendar" ? <Calendar width={20} height={20} /> : <Package width={20} height={20} />}
            </span>
            <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.01em]">{w.title}</h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{w.body}</p>
            <Link
              href={w.href}
              className="btn btn-secondary mt-6 w-fit px-5 text-[14px]"
            >
              {w.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EarnWithUber() {
  return (
    <section className="mt-20 bg-black py-16 text-white lg:mt-24 lg:py-20">
      <div className="shell grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="h-section">Earn with Uber</h2>
          <h3 className="mt-8 text-[20px] font-semibold tracking-[-0.02em]">
            Drive and earn on your schedule
          </h3>
          <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-white/70">
            Make money with rides. Use your car or rent one. Cash out whenever you
            like, and keep more of what you earn.
          </p>
          <Link
            href="/drive"
            className="btn mt-6 bg-white px-6 text-black hover:bg-white/90"
          >
            Sign up to drive
          </Link>

          <dl className="mt-10 grid max-w-[420px] grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {[
              ["GH₵ 3,480", "Average monthly earnings"],
              ["4 min", "Average pickup time"],
              ["24/7", "Support in Accra"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-[19px] font-semibold">{v}</dt>
                <dd className="mt-1 text-[12px] leading-snug text-white/55">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="rounded-lg bg-white/[.06] p-6">
            <div className="flex items-center justify-between">
              <p className="text-[13px] uppercase tracking-[.1em] text-white/50">
                Driver app preview
              </p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px]">
                Online
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Airport Residential → Osu", "GH₵ 42.00", "18 min"],
                ["East Legon → Accra Mall", "GH₵ 28.50", "12 min"],
                ["Labone → Ridge", "GH₵ 19.00", "9 min"],
              ].map(([route, fare, eta]) => (
                <div
                  key={route}
                  className="flex items-center justify-between rounded-lg bg-black/40 px-4 py-3.5 ring-1 ring-white/10"
                >
                  <div>
                    <p className="text-[14px] font-medium">{route}</p>
                    <p className="text-[12px] text-white/50">Trip · {eta}</p>
                  </div>
                  <span className="text-[14px] font-semibold">{fare}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BusinessCTA() {
  return (
    <section className="shell mt-20 lg:mt-24">
      <div className="grid items-center gap-10 rounded-lg bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
        <div>
          <h2 className="h-section">
            All the benefits of Uber, reimagined for business
          </h2>
          <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-muted">
            Uber for Business gives your organization more control, deeper insights,
            and features built for enterprise users. Manage and track business travel,
            meal programs, and more on one dashboard.
          </p>
          <Link href="/business" className="btn btn-primary mt-6 px-6">
            Learn more
          </Link>
        </div>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src="/images/business.jpg"
            alt="Woman riding in an Uber car with luggage, chart, and clipboard icons below"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function PhoneMock({ variant }: { variant: "rider" | "driver" }) {
  return (
    <div className="relative mx-auto h-[190px] w-[104px] rounded-[16px] border-[5px] border-black bg-white shadow-card">
      <div className="absolute left-1/2 top-[3px] h-[7px] w-[34px] -translate-x-1/2 rounded-full bg-black" />
      <div className="p-2 pt-4">
        {variant === "rider" ? (
          <>
            <p className="text-[6px] font-semibold uppercase tracking-wider text-black/40">
              Arriving in 3 min
            </p>
            <p className="mt-1 text-[9px] font-semibold">Kwame · UberX</p>
            <div className="mt-2 h-[64px] rounded-md bg-surface">
              <svg viewBox="0 0 90 64" className="h-full w-full">
                <path d="M0 50 L90 34" stroke="#d8d8d8" strokeWidth="6" fill="none" />
                <path d="M8 60 L30 30 L64 26 L88 6" stroke="#111" strokeWidth="2.5" fill="none" strokeDasharray="4 3" />
                <circle cx="30" cy="30" r="3" fill="#111" />
                <circle cx="86" cy="8" r="3.5" fill="#0E8345" />
              </svg>
            </div>
            <p className="mt-1.5 text-[7px] text-black/50">GR-1234-24 · Toyota Corolla</p>
          </>
        ) : (
          <>
            <p className="text-[6px] font-semibold uppercase tracking-wider text-black/40">
              You&apos;re online
            </p>
            <p className="mt-1 text-[9px] font-semibold">GH₵ 128.40 today</p>
            <div className="mt-2 space-y-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[14px] rounded bg-surface" />
              ))}
            </div>
            <div className="mt-2 rounded bg-black py-1 text-center text-[6px] font-semibold text-white">
              Go offline
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AppDownload() {
  return (
    <section className="shell mt-20 lg:mt-24">
      <h2 className="h-section">It&apos;s easier in the apps</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Download the Uber app",
            body: "Scan to download",
            variant: "rider" as const,
            cta: "Get the rider app",
          },
          {
            title: "Download the Driver app",
            body: "Scan to download",
            variant: "driver" as const,
            cta: "Get the driver app",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex items-center gap-6 rounded-lg border border-hair p-6 transition-shadow hover:shadow-card"
          >
            <PhoneMock variant={card.variant} />
            <div className="min-w-0 flex-1">
              <h3 className="text-[19px] font-semibold tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="mt-1 text-[14px] text-muted">{card.body}</p>
              <div className="mt-4 flex items-center gap-3">
                <QrCode />
                <div className="text-[12px] leading-snug text-muted">
                  Scan with your
                  <br />
                  phone camera
                </div>
              </div>
              <button className="btn btn-secondary btn-sm mt-4">{card.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QrCode() {
  // Deterministic decorative QR-style matrix (not a scannable code).
  const cells: boolean[] = [];
  for (let i = 0; i < 21 * 21; i++) {
    const x = i % 21;
    const y = Math.floor(i / 21);
    const finder =
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    cells.push(finder ? (x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5)) : (x * 7 + y * 13) % 5 < 2);
  }
  return (
    <div
      className="grid h-[64px] w-[64px] gap-0 bg-white p-1 ring-1 ring-line"
      style={{ gridTemplateColumns: "repeat(21, 1fr)" }}
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-black" : "bg-white"} />
      ))}
    </div>
  );
}

export function TrustStrip() {
  const items = [
    { icon: <Shield width={18} height={18} />, label: "Safety toolkit in every trip" },
    { icon: <Star width={18} height={18} />, label: "Top-rated drivers" },
    { icon: <Clock width={18} height={18} />, label: "Pickups in minutes" },
    { icon: <Plus width={18} height={18} />, label: "24/7 in-app support" },
  ];
  return (
    <section className="border-y border-hair">
      <div className="shell grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2.5 text-[13px]">
            <span className="text-black/70">{it.icon}</span>
            <span className="text-muted">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
