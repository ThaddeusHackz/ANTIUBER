"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { AccountNav } from "@/components/rider/account-nav";
import { RiderGuard } from "@/components/rider/rider-guard";
import { useSession } from "@/lib/session";
import { readDemo, onDemoChange } from "@/lib/demo-store";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { shortGHS, dayLabel } from "@/lib/format";
import type { RideRow } from "@/lib/types";
import { Car, ChevronRight, Receipt, StarFilled } from "@/components/icons";

export default function ActivityPage() {
  return (
    <SiteFrame footer={false}>
      <AccountNav />
      <RiderGuard>
        <ActivityInner />
      </RiderGuard>
    </SiteFrame>
  );
}

function ActivityInner() {
  const { user, mode } = useSession();
  const [rides, setRides] = useState<RideRow[] | null>(null);
  const [tab, setTab] = useState<"past" | "upcoming">("past");
  const [open, setOpen] = useState<RideRow | null>(null);

  useEffect(() => {
    if (mode === "demo") {
      const load = () =>
        setRides(
          [...readDemo().rides].sort(
            (a, b) =>
              new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
          )
        );
      load();
      return onDemoChange(load);
    }

    if (!supabaseConfigured || !user) return;
    const supabase = createClient();
    void (async () => {
      const { data } = await supabase
        .from("ride_rides")
        .select("*")
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false });
      setRides((data as RideRow[]) ?? []);
    })();
  }, [user, mode]);

  const past = (rides ?? []).filter((r) => r.status !== "upcoming");
  const upcoming = (rides ?? []).filter((r) => r.status === "upcoming");
  const list = tab === "past" ? past : upcoming;

  const total = past
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + Number(r.fare), 0);

  return (
    <div className="shell max-w-[860px] py-10">
      <h1 className="text-[32px] font-semibold tracking-[-0.03em]">Activity</h1>
      <p className="mt-1 text-[14px] text-muted">
        {past.length} trips · {shortGHS(total)} spent with Uber
      </p>

      <div className="mt-6 flex gap-1 rounded-full bg-surface p-1 text-[13px] font-medium">
        {[
          { id: "past" as const, label: `Past (${past.length})` },
          { id: "upcoming" as const, label: `Upcoming (${upcoming.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full py-2 transition-colors ${
              tab === t.id ? "bg-white shadow-sm" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {rides === null && (
        <div className="mt-10 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface" />
          ))}
        </div>
      )}

      {rides !== null && list.length === 0 && (
        <div className="mt-12 rounded-lg border border-hair p-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface">
            <Receipt width={20} height={20} />
          </span>
          <p className="mt-4 text-[16px] font-medium">No rides yet</p>
          <p className="mt-1 text-[14px] text-muted">
            Your completed trips will show up here.
          </p>
          <Link href="/ride" className="btn btn-primary mt-5">
            Book a ride
          </Link>
        </div>
      )}

      <div className="mt-6 divide-y divide-hair">
        {list.map((ride) => (
          <button
            key={ride.id}
            onClick={() => setOpen(ride)}
            className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-surface/60"
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                ride.status === "cancelled" ? "bg-surface text-muted" : "bg-black text-white"
              }`}
            >
              {ride.status === "cancelled" ? <Receipt width={18} height={18} /> : <Car width={19} height={19} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-[15px] font-medium">
                  {ride.dropoff}
                </span>
                {ride.status === "cancelled" && (
                  <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                    Cancelled
                  </span>
                )}
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-muted">
                {dayLabel(ride.requested_at)} · {ride.tier} ·{" "}
                {Number(ride.distance_km).toFixed(1)} km
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-[15px] font-semibold">
                {ride.status === "cancelled" ? "—" : shortGHS(Number(ride.fare))}
              </span>
              <span className="block text-[11px] text-subtle">
                {ride.rating ? `${ride.rating}★` : ""}
              </span>
            </span>
            <ChevronRight width={16} height={16} className="shrink-0 text-subtle" />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
          <div className="absolute inset-0" onClick={() => setOpen(null)} aria-hidden />
          <div className="relative w-full max-w-[420px] rounded-t-xl2 bg-white p-6 shadow-sheet animate-sheet-up sm:rounded-xl2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-subtle">
                  Receipt
                </p>
                <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">
                  {shortGHS(Number(open.fare))}
                </h2>
                <p className="mt-0.5 text-[13px] text-muted">
                  {dayLabel(open.requested_at)}
                </p>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="text-[13px] text-muted hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-lg bg-surface p-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className="h-2 w-2 rounded-full bg-black" />
                  <span className="my-1 w-px flex-1 bg-black/20" />
                  <span className="h-2 w-2 rounded-full border-2 border-black" />
                </div>
                <div className="flex-1 space-y-4 text-[14px]">
                  <p className="truncate">{open.pickup}</p>
                  <p className="truncate font-medium">{open.dropoff}</p>
                </div>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-[13px]">
              <Row label="Ride type" value={open.tier} />
              <Row label="Distance" value={`${Number(open.distance_km).toFixed(1)} km`} />
              <Row label="Duration" value={`${open.duration_min} min`} />
              <Row label="Payment" value={open.payment_method || "—"} />
              {open.driver_name && open.driver_name !== "—" && (
                <Row label="Driver" value={open.driver_name} />
              )}
              {open.plate && open.plate !== "—" && <Row label="Vehicle" value={`${open.vehicle} · ${open.plate}`} />}
            </dl>

            {open.rating ? (
              <p className="mt-4 flex items-center gap-1 text-[13px] text-muted">
                You rated this trip
                <StarFilled width={13} height={13} className="text-black" />
                {open.rating}
              </p>
            ) : null}

            <button onClick={() => setOpen(null)} className="btn btn-primary mt-6 w-full">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate text-right font-medium">{value}</dd>
    </div>
  );
}
