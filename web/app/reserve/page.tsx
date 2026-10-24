"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { Clock, Calendar, Check, ChevronDown, Shield } from "@/components/icons";

const SLOTS = ["In 30 minutes", "In 2 hours", "Tomorrow, 7:30 AM", "Tomorrow, 5:00 PM", "Pick another time"];

export default function ReservePage() {
  const [slot, setSlot] = useState(SLOTS[0]);
  const [pickup, setPickup] = useState("Current location");
  const [dropoff, setDropoff] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  if (done) {
    return (
      <SiteFrame>
        <div className="shell max-w-[560px] py-20 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good text-white">
            <Check width={24} height={24} />
          </span>
          <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.02em]">
            Ride reserved
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {slot} · from <strong className="text-black">{pickup}</strong> to{" "}
            <strong className="text-black">{dropoff || "your destination"}</strong>.
            We&apos;ll notify you when a driver is on the way.
          </p>
          <div className="mt-8 flex flex-col gap-2">
            <button onClick={() => router.push("/activity")} className="btn btn-primary">
              View in activity
            </button>
            <button
              onClick={() => {
                setDone(false);
                setDropoff("");
              }}
              className="btn btn-secondary"
            >
              Reserve another ride
            </button>
          </div>
        </div>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame>
      <div className="shell max-w-[960px] py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[.1em] text-subtle">
              Reserve
            </p>
            <h1 className="mt-2 text-[36px] font-semibold leading-tight tracking-[-0.03em]">
              Plan your trip in advance
            </h1>
            <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-muted">
              Book your ride up to 90 days ahead. We&apos;ll match you with a driver
              shortly before your pickup time, and the price is locked in.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="mt-7 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Pickup time</label>
                <div className="flex flex-wrap gap-2">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                        slot === s
                          ? "border-black bg-black text-white"
                          : "border-hair hover:bg-surface"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-lg bg-surface p-1.5">
                <div className="flex items-center gap-3 px-3.5">
                  <Clock width={17} height={17} className="text-muted" />
                  <input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup location"
                    className="h-[46px] w-full bg-transparent text-[15px] outline-none"
                  />
                </div>
                <div className="mx-3.5 h-px bg-line" />
                <div className="flex items-center gap-3 bg-white px-3.5">
                  <Calendar width={17} height={17} className="text-muted" />
                  <input
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="Dropoff location"
                    className="h-[46px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
                  />
                </div>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for your driver (optional)"
                rows={3}
                className="field resize-none"
              />

              <button type="submit" className="btn btn-primary w-full sm:w-auto sm:px-8">
                Reserve ride
              </button>
            </form>
          </div>

          <aside className="rounded-xl2 bg-surface p-6">
            <div className="rounded-lg bg-white p-5 shadow-card">
              <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-subtle">
                Your reservation
              </p>
              <p className="mt-3 text-[18px] font-semibold">{slot}</p>
              <div className="mt-4 space-y-3 text-[13px]">
                <div className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-black" />
                  <span>{pickup}</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full border-2 border-black" />
                  <span>{dropoff || "Add a destination"}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-hair pt-3 text-[13px]">
                <span className="text-muted">Estimated fare</span>
                <span className="font-semibold">GH₵ 48.00</span>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-[13px] text-muted">
              <li className="flex gap-2">
                <Check width={16} height={16} className="mt-0.5 shrink-0 text-black" />
                Price locked in at booking
              </li>
              <li className="flex gap-2">
                <Check width={16} height={16} className="mt-0.5 shrink-0 text-black" />
                Free cancellation up to 1 hour before
              </li>
              <li className="flex gap-2">
                <Shield width={16} height={16} className="mt-0.5 shrink-0 text-black" />
                Same safety features as an on-demand ride
              </li>
            </ul>

            <button className="mt-5 flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-[13px]">
              <span className="text-muted">Payment</span>
              <span className="flex items-center gap-1 font-medium">
                Visa •••• 4242 <ChevronDown width={14} height={14} />
              </span>
            </button>
          </aside>
        </div>
      </div>
    </SiteFrame>
  );
}
