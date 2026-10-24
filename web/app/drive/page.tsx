"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { shortGHS } from "@/lib/format";
import { Check, Car, Clock, Shield, ArrowRight, Star } from "@/components/icons";

export default function DrivePage() {
  const [hours, setHours] = useState(30);
  const [city, setCity] = useState("Accra");

  const weekly = useMemo(() => {
    const rates: Record<string, number> = {
      Accra: 92,
      Kumasi: 74,
      "Sekondi-Takoradi": 68,
      "Cape Coast": 61,
    };
    const gross = hours * (rates[city] ?? 80);
    return Math.round(gross);
  }, [hours, city]);

  return (
    <SiteFrame>
      <section className="bg-black text-white">
        <div className="shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-white/50">
              Drive with Uber
            </p>
            <h1 className="mt-3 text-[42px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[56px]">
              Drive and earn on your schedule
            </h1>
            <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-white/70">
              Make money with rides across Accra, Kumasi and Takoradi. Use your own
              car or rent one, and cash out whenever you like.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#signup" className="btn bg-white px-6 text-black hover:bg-white/90">
                Sign up to drive
              </a>
              <a
                href="#earnings"
                className="btn border border-white/25 px-6 text-white hover:bg-white/10"
              >
                Estimate earnings
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-[13px] text-white/60">
              <span className="flex items-center gap-2">
                <Star width={15} height={15} /> Top-rated drivers earn more
              </span>
              <span className="flex items-center gap-2">
                <Clock width={15} height={15} /> Weekly instant cash out
              </span>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/images/hero-travel.jpg"
              alt="Driver on the road in Accra"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section id="earnings" className="shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em]">
              Estimate your earnings
            </h2>
            <p className="mt-2 max-w-[420px] text-[15px] text-muted">
              Move the slider to see what a typical week could look like. Estimates
              exclude service fees, fuel and tolls.
            </p>

            <div className="mt-8">
              <label className="flex items-center justify-between text-[14px] font-medium">
                Hours per week
                <span className="tabular-nums">{hours} h</span>
              </label>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-3 w-full accent-black"
              />
            </div>

            <div className="mt-6">
              <p className="text-[14px] font-medium">City</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Accra", "Kumasi", "Sekondi-Takoradi", "Cape Coast"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={`rounded-full border px-3.5 py-2 text-[13px] font-medium ${
                      city === c ? "border-black bg-black text-white" : "border-hair hover:bg-surface"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl2 bg-surface p-8">
            <p className="text-[13px] uppercase tracking-[.1em] text-muted">
              Estimated weekly gross
            </p>
            <p className="mt-2 text-[48px] font-semibold tracking-[-0.04em]">
              {shortGHS(weekly)}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              About {shortGHS(Math.round(weekly / 4))} per week in {city} at {hours} h/week.
            </p>
            <ul className="mt-6 space-y-3 text-[14px]">
              {[
                "Keep 100% of tips",
                "No vehicle? Rent through Uber",
                "In-app navigation and earnings tracker",
                "24/7 driver support",
              ].map((l) => (
                <li key={l} className="flex gap-2">
                  <Check width={17} height={17} className="mt-0.5 shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="requirements" className="bg-surface py-16">
        <div className="shell">
          <h2 className="text-[32px] font-semibold tracking-[-0.03em]">Requirements</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Car />, title: "Your vehicle", body: "A 4-door car, 2010 or newer, in good condition." },
              { icon: <Shield />, title: "Documents", body: "Driver's licence, insurance and vehicle registration." },
              { icon: <Star />, title: "Background check", body: "A background screening and driving record review." },
              { icon: <Clock />, title: "Availability", body: "Be 21 or older and able to work in Ghana." },
            ].map((r) => (
              <div key={r.title} className="rounded-lg bg-white p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                  {r.icon}
                </span>
                <p className="mt-4 text-[15px] font-semibold">{r.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="signup" className="shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em]">
              Ready to start earning?
            </h2>
            <p className="mt-2 max-w-[420px] text-[15px] text-muted">
              Tell us a little about yourself and we&apos;ll walk you through the
              documents you need.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-xl2 border border-hair p-6"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="First name" className="field" />
              <input placeholder="Last name" className="field" />
              <input placeholder="Email" type="email" className="field sm:col-span-2" />
              <input placeholder="+233 24 000 0000" className="field sm:col-span-2" />
              <input placeholder="City" className="field sm:col-span-2" />
            </div>
            <button className="btn btn-primary mt-4 w-full">
              Sign up to drive <ArrowRight width={16} height={16} />
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-subtle">
              Demo form — no driver data is stored or submitted.
            </p>
          </form>
        </div>
      </section>
    </SiteFrame>
  );
}
