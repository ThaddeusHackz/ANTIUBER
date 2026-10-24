"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { AccountNav } from "@/components/rider/account-nav";
import { RiderGuard } from "@/components/rider/rider-guard";
import { AccraMap } from "@/components/rider/accra-map";
import { useSession } from "@/lib/session";
import { readDemo } from "@/lib/demo-store";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { breakdownFor } from "@/lib/fares";
import { shortGHS, dayLabel, clock } from "@/lib/format";
import type { RideRow } from "@/lib/types";
import {
  Car,
  ChevronLeft,
  StarFilled,
  Shield,
  Receipt,
  ArrowRight,
} from "@/components/icons";

export default function TripReceiptPage() {
  return (
    <SiteFrame footer={false}>
      <AccountNav />
      <RiderGuard>
        <ReceiptInner />
      </RiderGuard>
    </SiteFrame>
  );
}

function ReceiptInner() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const { user, mode } = useSession();
  const [ride, setRide] = useState<RideRow | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    if (mode === "demo") {
      setRide(readDemo().rides.find((r) => r.id === id) ?? null);
      return;
    }
    if (!supabaseConfigured || !user) {
      setRide(null);
      return;
    }
    const supabase = createClient();
    void (async () => {
      const { data } = await supabase
        .from("ride_rides")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      setRide((data as RideRow) ?? null);
    })();
  }, [id, mode, user]);

  if (ride === undefined) {
    return (
      <div className="shell max-w-[860px] py-10">
        <div className="h-6 w-32 animate-pulse rounded bg-surface" />
        <div className="mt-4 h-[220px] w-full animate-pulse rounded-xl2 bg-surface" />
        <div className="mt-4 h-24 w-full animate-pulse rounded-lg bg-surface" />
      </div>
    );
  }

  if (ride === null) {
    return (
      <div className="shell max-w-[860px] py-10">
        <Link
          href="/activity"
          className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-black"
        >
          <ChevronLeft width={15} height={15} /> Activity
        </Link>
        <div className="mt-8 rounded-lg border border-hair p-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface">
            <Receipt width={20} height={20} />
          </span>
          <p className="mt-4 text-[16px] font-medium">This receipt isn’t available</p>
          <p className="mt-1 text-[14px] text-muted">
            It may belong to another account, or the trip has been removed.
          </p>
          <Link href="/activity" className="btn btn-secondary mt-5">
            Back to activity
          </Link>
        </div>
      </div>
    );
  }

  const fare = Number(ride.fare);
  const distance = Number(ride.distance_km);
  const lines = breakdownFor(fare, distance);
  const cancelled = ride.status === "cancelled";
  const rebookHref = `/ride?destination=${encodeURIComponent(ride.dropoff)}&pickup=${encodeURIComponent(
    ride.pickup
  )}`;

  return (
    <div className="shell max-w-[860px] py-8">
      <div className="flex items-center justify-between no-print">
        <Link
          href="/activity"
          className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-black"
        >
          <ChevronLeft width={15} height={15} /> Activity
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="text-[13px] text-muted transition-colors hover:text-black"
          >
            Download receipt
          </button>
          <Link href={rebookHref} className="btn btn-primary px-5">
            Rebook
          </Link>
        </div>
      </div>

      <header className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-subtle">
          {cancelled ? "Cancelled trip" : "Trip receipt"}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[40px] font-semibold leading-none tracking-[-0.03em] tnum">
            {cancelled ? "—" : shortGHS(fare)}
          </h1>
          <p className="text-[13px] text-muted">
            {dayLabel(ride.requested_at)} · {ride.tier}
          </p>
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-xl2 border border-hair print-plain">
        <div className="relative h-[240px] w-full">
          <AccraMap
            className="h-full w-full"
            progress={1}
            showRoute
            showCars={false}
            pickupLabel={ride.pickup}
            dropoffLabel={ride.dropoff}
          />
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black" />
              <span className="my-1 w-px flex-1 bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full border-2 border-black" />
            </div>
            <div className="min-w-0 flex-1 space-y-4 text-[14px]">
              <div className="min-w-0">
                <p className="truncate">{ride.pickup}</p>
                <p className="mt-0.5 text-[12px] text-subtle">{clock(ride.requested_at)}</p>
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{ride.dropoff}</p>
                <p className="mt-0.5 text-[12px] text-subtle">
                  {ride.completed_at ? clock(ride.completed_at) : "—"} ·{" "}
                  {ride.duration_min} min · {distance.toFixed(1)} km
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-surface px-4 py-3 sm:min-w-[220px]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-white">
              <Car width={18} height={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">{ride.driver_name || "—"}</p>
              <p className="truncate text-[12px] text-muted">
                {ride.vehicle || "—"}
                {ride.plate ? ` · ${ride.plate}` : ""}
              </p>
            </div>
            {Number(ride.driver_rating) > 0 && (
              <span className="ml-auto flex shrink-0 items-center gap-0.5 text-[12px] font-medium">
                <StarFilled width={12} height={12} />
                {Number(ride.driver_rating).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_320px]">
        <section className="rounded-xl2 border border-hair p-5 print-plain">
          <h2 className="text-[15px] font-semibold">Fare breakdown</h2>
          <dl className="mt-3 space-y-2.5 text-[13px]">
            {lines.map((line) => (
              <div key={line.label} className="flex justify-between gap-6">
                <dt className="text-muted">{line.label}</dt>
                <dd className="tnum font-medium">{shortGHS(line.value)}</dd>
              </div>
            ))}
            <div className="mt-1 flex justify-between gap-6 border-t border-hair pt-3 text-[14px]">
              <dt className="font-semibold">Total</dt>
              <dd className="tnum font-semibold">{cancelled ? "—" : shortGHS(fare)}</dd>
            </div>
            <div className="flex justify-between gap-6 text-[13px]">
              <dt className="text-muted">Charged to</dt>
              <dd className="font-medium">{ride.payment_method || "—"}</dd>
            </div>
          </dl>

          <p className="mt-4 text-[11px] leading-relaxed text-subtle">
            Prices include the booking fee and Ghana VAT where applicable. This receipt is
            generated from the trip record and stays available in your account.
          </p>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl2 border border-hair p-5 print-plain">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold">
              <Shield width={16} height={16} /> Safety
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Every trip includes the safety toolkit, 24/7 support and live trip sharing.
            </p>
            <Link
              href="/help"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium underline decoration-[1.5px] underline-offset-4 no-print"
            >
              Report an issue <ArrowRight width={13} height={13} />
            </Link>
          </div>

          <div className="rounded-xl2 border border-hair p-5 print-plain">
            <h2 className="text-[15px] font-semibold">Your rating</h2>
            {ride.rating ? (
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarFilled
                    key={n}
                    width={16}
                    height={16}
                    className={n <= Number(ride.rating) ? "text-black" : "text-line"}
                  />
                ))}
                <span className="ml-2 text-[13px] text-muted">{ride.rating} of 5</span>
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-muted">You didn’t rate this trip.</p>
            )}
          </div>

          <div className="rounded-xl2 bg-surface p-5 no-print">
            <p className="text-[13px] font-medium">Need this for expenses?</p>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary mt-3 w-full bg-white"
            >
              Print / save as PDF
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
