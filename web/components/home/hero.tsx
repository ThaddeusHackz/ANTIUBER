"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CityPicker } from "@/components/city-picker";
import { Clock, CircleDot, Pin, ChevronDown, Crosshair, Car, ArrowRight } from "@/components/icons";
import { POPULAR_ROUTES, quotesFor } from "@/lib/fares";
import { shortGHS } from "@/lib/format";

export function Hero() {
  const [city, setCity] = useState("Accra");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [when, setWhen] = useState<"now" | "later">("now");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const router = useRouter();

  const quote = useMemo(() => {
    const to = dropoff.trim();
    if (to.length < 2) return null;
    const from = pickup.trim() || "Current location";
    const rows = quotesFor(from, to);
    return {
      from,
      to,
      rows,
      cheapest: rows[0],
    };
  }, [pickup, dropoff]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dropoff) params.set("destination", dropoff);
    if (pickup) params.set("pickup", pickup);
    if (when === "later") params.set("schedule", "1");
    router.push(`/ride${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="shell grid items-start gap-10 pb-6 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16 lg:pb-16 lg:pt-14">
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-good" />
            <span className="font-medium">{city}, GH</span>
            <button
              onClick={() => setPickerOpen(true)}
              className="link-underline text-muted hover:text-black"
            >
              Change city
            </button>
          </div>

          <h1 className="h-display mt-3">Go anywhere</h1>

          <form onSubmit={submit} className="mt-7 w-full max-w-[520px]">
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWhen(when === "now" ? "later" : "now")}
                className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[13px] font-medium hover:bg-[#ededed]"
              >
                <Clock width={15} height={15} />
                {when === "now" ? "Pickup now" : "Schedule for later"}
                <ChevronDown width={14} height={14} />
              </button>
              {when === "later" && (
                <input
                  type="datetime-local"
                  className="rounded-full border border-line px-3 py-1.5 text-[13px]"
                  aria-label="Pickup date and time"
                />
              )}
            </div>

            <div className="relative rounded-lg bg-surface p-1.5">
              <div className="flex items-center gap-3 rounded-md px-3.5">
                <Crosshair width={18} height={18} className="text-muted" />
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Pickup location"
                  aria-label="Pickup location"
                  className="h-[46px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
                />
              </div>
              <div className="mx-3.5 flex items-center">
                <div className="h-px w-full bg-line" />
              </div>
              <div className="flex items-center gap-3 rounded-md bg-white px-3.5 shadow-[0_1px_2px_rgba(0,0,0,.08)]">
                <CircleDot width={18} height={18} className="text-muted" />
                <input
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Dropoff location"
                  aria-label="Dropoff location"
                  className="h-[46px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
                />
                <Pin width={16} height={16} className="text-subtle" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary px-6">
                See prices
              </button>
              <Link
                href="/login"
                className="text-[14px] font-medium underline decoration-[1.5px] underline-offset-4 hover:decoration-2"
              >
                Log in to check your activity
              </Link>
            </div>

            {/* Live quote — the thing the real page makes you click for. */}
            {quote && (
              <div
                key={`${quote.from}-${quote.to}`}
                className="mt-5 overflow-hidden rounded-xl2 border border-hair bg-white shadow-card animate-scale-in"
                aria-live="polite"
              >
                <div className="flex items-center justify-between gap-3 border-b border-hair px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-subtle">
                      Live estimate
                    </p>
                    <p className="mt-0.5 truncate text-[13px] font-medium">
                      {quote.from} → {quote.to}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-good/10 px-2.5 py-1 text-[11px] font-semibold text-good">
                    Prices locked 5 min
                  </span>
                </div>

                <ul className="divide-y divide-hair">
                  {quote.rows.map(({ tier, price }, i) => (
                    <li
                      key={tier.id}
                      className="flex items-center gap-3 px-4 py-2.5 animate-price-in"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface">
                        <Car width={16} height={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-[14px] font-medium">{tier.name}</span>
                          {i === 0 && (
                            <span className="rounded bg-black px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                              Cheapest
                            </span>
                          )}
                          <span className="text-[11px] text-subtle">· {tier.seats} seats</span>
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-muted">
                          {tier.eta} away · {tier.blurb}
                        </span>
                      </span>
                      <span className="tnum shrink-0 text-[15px] font-semibold">
                        {shortGHS(price)}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="submit"
                  className="flex w-full items-center justify-between gap-2 bg-black px-4 py-3 text-left text-[13px] font-medium text-white transition-colors hover:bg-[#1f1f1f]"
                >
                  <span>Continue with {quote.cheapest.tier.name}</span>
                  <ArrowRight width={15} height={15} />
                </button>
              </div>
            )}
          </form>

          {!quote && (
            <div className="mt-6 max-w-[520px]">
              <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-subtle">
                Popular in {city}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {POPULAR_ROUTES.slice(0, 3).map((r) => (
                  <button
                    key={r.to}
                    type="button"
                    onClick={() => {
                      setPickup(r.from);
                      setDropoff(r.to);
                    }}
                    className="group flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] transition-colors hover:border-black hover:bg-surface"
                  >
                    <span className="font-medium">{r.to.split(",")[0]}</span>
                    <span className="text-subtle group-hover:text-muted">· {r.note}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-fade-in">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surfaceAlt">
            <Image
              src="/images/hero-travel.jpg"
              alt="Travel collage: packing, navigation, taxis, luggage, and reunions during urban trips"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>

          {quote && (
            <div className="pointer-events-none absolute -bottom-4 left-4 right-4 rounded-xl2 bg-white/95 p-3.5 shadow-menu backdrop-blur animate-scale-in sm:left-6 sm:right-auto sm:w-[280px]">
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-black text-white">
                  <Car width={18} height={18} />
                  <span className="absolute inset-0 rounded-full border border-black/20 animate-pulseRing" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">
                    {quote.cheapest.tier.name} · {quote.cheapest.tier.eta} away
                  </p>
                  <p className="truncate text-[12px] text-muted">
                    Kwame · 4.94★ · Toyota Corolla
                  </p>
                </div>
                <span className="tnum ml-auto shrink-0 text-[15px] font-semibold">
                  {shortGHS(quote.cheapest.price)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <CityPicker
        open={pickerOpen}
        city={city}
        onClose={() => setPickerOpen(false)}
        onSelect={setCity}
      />
    </section>
  );
}
