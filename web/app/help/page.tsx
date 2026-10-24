"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { QUICK_HELP } from "@/lib/content";
import { Search, ChevronDown, Shield, Receipt, Card, User, Car, Clock } from "@/components/icons";

const FAQS = [
  {
    q: "How do I request a ride?",
    a: "Open the app or uber.com, enter your destination, choose a ride option and tap request. You'll be matched with a nearby driver in a few minutes.",
  },
  {
    q: "How are fares calculated in Ghana?",
    a: "Fares are based on a base rate plus distance and time, and can change with demand. You'll always see an upfront price before you request.",
  },
  {
    q: "Can I pay with cash?",
    a: "Yes. Cash is available in Ghana alongside cards and Uber Cash. Choose your payment method before requesting.",
  },
  {
    q: "What if I need to cancel?",
    a: "You can cancel for free within 2 minutes of requesting. After your driver has started heading to you, a cancellation fee may apply.",
  },
  {
    q: "How do teen accounts work?",
    a: "Teen accounts let 13–17 year olds ride with top-rated drivers, with PIN verification and live trip tracking for parents.",
  },
  {
    q: "I left an item in the car",
    a: "Open the trip in Activity, tap Help with this trip and choose I lost an item. We'll connect you with your driver.",
  },
];

export default function HelpPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const faqs = FAQS.filter(
    (f) =>
      !q.trim() ||
      f.q.toLowerCase().includes(q.toLowerCase()) ||
      f.a.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <SiteFrame>
      <section className="bg-surface py-14">
        <div className="shell max-w-[760px] text-center">
          <h1 className="text-[38px] font-semibold tracking-[-0.03em]">How can we help?</h1>
          <div className="mx-auto mt-6 flex max-w-[520px] items-center gap-3 rounded-lg bg-white px-4 shadow-card">
            <Search className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search help articles"
              className="h-[52px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
            />
          </div>
        </div>
      </section>

      <div className="shell max-w-[900px] py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {QUICK_HELP.map((h, i) => {
            const icons = [Receipt, Card, Shield, User];
            const Icon = icons[i] ?? Car;
            return (
              <div
                key={h.title}
                className="rounded-lg border border-hair p-5 transition-shadow hover:shadow-card"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                  <Icon width={18} height={18} />
                </span>
                <p className="mt-4 text-[15px] font-semibold">{h.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{h.body}</p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-12 text-[24px] font-semibold tracking-[-0.02em]">
          Frequently asked questions
        </h2>
        <div className="mt-4 divide-y divide-hair border-y border-hair">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="text-[15px] font-medium">{f.q}</span>
                <ChevronDown
                  width={18}
                  height={18}
                  className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <p className="pb-4 text-[14px] leading-relaxed text-muted animate-fade-in">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-lg bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Clock width={20} height={20} />
            <div>
              <p className="text-[15px] font-semibold">Still need help?</p>
              <p className="text-[13px] text-muted">24/7 support in the app and on the web.</p>
            </div>
          </div>
          <Link href="/ride" className="btn btn-primary btn-sm">
            Contact support
          </Link>
        </div>
      </div>
    </SiteFrame>
  );
}
