"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AccraMap } from "@/components/rider/accra-map";
import { useSession } from "@/lib/session";
import { readDemo, addDemoRide } from "@/lib/demo-store";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { SAVED_PLACES, SUGGESTED_PLACES, RECENT_DESTINATIONS } from "@/lib/content";
import { shortGHS } from "@/lib/format";
import {
  Search,
  Home,
  Briefcase,
  Clock,
  Star,
  StarFilled,
  Car,
  Card,
  ChevronRight,
  ChevronLeft,
  Crosshair,
  CircleDot,
  Pin,
  Shield,
  Phone,
  ArrowRight,
  Calendar,
  Check,
  Sparkle,
} from "@/components/icons";

type Stage =
  | "idle"
  | "search"
  | "options"
  | "matching"
  | "driver"
  | "trip"
  | "receipt";

type Tier = {
  id: string;
  name: string;
  seats: number;
  blurb: string;
  base: number;
  perKm: number;
  perMin: number;
  eta: string;
};

const FALLBACK_TIERS: Tier[] = [
  { id: "uberx", name: "UberX", seats: 4, blurb: "Affordable everyday rides", base: 5.5, perKm: 3.2, perMin: 0.45, eta: "3 min" },
  { id: "comfort", name: "Comfort", seats: 4, blurb: "Newer cars with extra legroom", base: 8, perKm: 4.1, perMin: 0.6, eta: "5 min" },
  { id: "uberxl", name: "UberXL", seats: 6, blurb: "Affordable rides for groups up to 6", base: 11, perKm: 5.2, perMin: 0.75, eta: "7 min" },
  { id: "share", name: "UberX Share", seats: 2, blurb: "Share your ride and save", base: 3.8, perKm: 2.3, perMin: 0.32, eta: "6 min" },
];

const DRIVERS = [
  { name: "Kwame Mensah", rating: 4.94, vehicle: "Toyota Corolla · Silver", plate: "GR-4821-24" },
  { name: "Ama Boateng", rating: 4.98, vehicle: "Hyundai Elantra · Black", plate: "GR-9931-23" },
  { name: "Yaw Owusu", rating: 4.91, vehicle: "Toyota Sienna · White", plate: "GE-2210-22" },
  { name: "Efua Addo", rating: 4.96, vehicle: "Kia Rio · Blue", plate: "GW-7742-25" },
];

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function estimateDistance(destination: string) {
  const h = hashString(destination);
  const distance = 3.2 + (h % 118) / 10; // 3.2 – 14.9 km
  const duration = Math.round(distance * 2.4 + 4 + (h % 7));
  return { distance: Math.round(distance * 10) / 10, duration };
}

export function RideExperience() {
  const params = useSearchParams();
  const { user, profile, loading, mode } = useSession();

  const [stage, setStage] = useState<Stage>("idle");
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<string | null>(
    params.get("destination")
  );
  const [pickup, setPickup] = useState(params.get("pickup") || "Current location");
  const [selectedTier, setSelectedTier] = useState<Tier>(FALLBACK_TIERS[0]);
  const [tiers, setTiers] = useState<Tier[]>(FALLBACK_TIERS);
  const [payment, setPayment] = useState("Visa •••• 4242");
  const [savedPlaces, setSavedPlaces] = useState(SAVED_PLACES as { label: string; address: string; icon: "home" | "work" }[]);
  const [driver, setDriver] = useState(DRIVERS[0]);
  const [etaMin, setEtaMin] = useState(3);
  const [tripProgress, setTripProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);
  const [fast, setFast] = useState(false);
  const [ridesCount, setRidesCount] = useState<number | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const est = useMemo(
    () => (destination ? estimateDistance(destination) : null),
    [destination]
  );

  const fareFor = useCallback(
    (t: Tier) => {
      if (!est) return 0;
      const raw = t.base + t.perKm * est.distance + t.perMin * est.duration;
      return Math.round(raw * 100) / 100;
    },
    [est]
  );

  // Load fares, saved places and payment methods for the signed-in rider.
  useEffect(() => {
    if (mode === "demo") {
      const d = readDemo();
      setSavedPlaces(
        d.places.map((p) => ({
          label: p.label,
          address: p.address,
          icon: (p.icon === "work" ? "work" : "home") as "home" | "work",
        }))
      );
      const p = d.payments.find((x) => x.is_default) ?? d.payments[0];
      if (p) {
        setPayment(
          p.kind === "wallet" ? p.brand : `${p.brand} •••• ${p.last4}`
        );
      }
      setRidesCount(d.rides.length);
      return;
    }

    if (!supabaseConfigured || !user) return;
    const supabase = createClient();

    void (async () => {
      const { data: fareRows } = await supabase
        .from("ride_fares")
        .select("*")
        .eq("active", true)
        .order("sort_order");

      if (fareRows && fareRows.length) {
        setTiers(
          fareRows.map((r: Record<string, unknown>) => ({
            id: String(r.id),
            name: String(r.tier),
            seats: Number(r.seats),
            blurb: String(r.blurb),
            base: Number(r.base_fare),
            perKm: Number(r.per_km),
            perMin: Number(r.per_min),
            eta: `${2 + (Number(r.sort_order) * 2)} min`,
          }))
        );
      }

      const { data: places } = await supabase
        .from("ride_places")
        .select("*")
        .eq("user_id", user.id);

      if (places && places.length) {
        setSavedPlaces(
          places.map((p: Record<string, unknown>) => ({
            label: String(p.label),
            address: String(p.address),
            icon: (p.icon === "work" ? "work" : "home") as "home" | "work",
          }))
        );
      }

      const { data: pays } = await supabase
        .from("ride_payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (pays && pays.length) {
        const p = pays[0] as Record<string, unknown>;
        setPayment(
          p.kind === "wallet"
            ? String(p.brand)
            : `${String(p.brand)} •••• ${String(p.last4)}`
        );
      }

      const { count } = await supabase
        .from("ride_rides")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      setRidesCount(count ?? 0);
    })();
  }, [user, mode]);

  // If a destination arrived via query string, jump straight to options.
  useEffect(() => {
    if (params.get("destination")) setStage("options");
    if (params.get("schedule")) setStage("options");
  }, [params]);

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const suggestions = useMemo(() => {
    const all = [...SUGGESTED_PLACES];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) =>
        s.label.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );
  }, [query]);

  const chooseDestination = (label: string) => {
    setDestination(label);
    setStage("options");
  };

  const requestRide = () => {
    setStage("matching");
    setFast(false);
    const wait = 2200;
    const t = setTimeout(() => {
      setDriver(DRIVERS[hashString(destination ?? "accra") % DRIVERS.length]);
      setEtaMin(3);
      setStage("driver");
    }, wait);
    timer.current = t as unknown as ReturnType<typeof setInterval>;
  };

  // Driver arriving countdown
  useEffect(() => {
    if (stage !== "driver") return;
    const speed = fast ? 220 : 1400;
    const id = setInterval(() => {
      setEtaMin((m) => {
        if (m <= 1) {
          clearInterval(id);
          setStage("trip");
          setTripProgress(0);
          return 0;
        }
        return m - 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [stage, fast]);

  // Trip progress
  useEffect(() => {
    if (stage !== "trip") return;
    const step = fast ? 18 : 7;
    const id = setInterval(() => {
      setTripProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(id);
          setStage("receipt");
          return 100;
        }
        return next;
      });
    }, fast ? 200 : 900);
    return () => clearInterval(id);
  }, [stage, fast]);

  // Persist the completed ride
  useEffect(() => {
    if (stage !== "receipt" || saved || !est) return;
    setSaved(true);

    if (mode === "demo") {
      addDemoRide({
        status: "completed",
        tier: selectedTier.name,
        pickup,
        dropoff: destination ?? "",
        distance_km: est.distance,
        duration_min: est.duration,
        fare: fareFor(selectedTier),
        currency: "GHS",
        driver_name: driver.name,
        driver_rating: driver.rating,
        vehicle: driver.vehicle,
        plate: driver.plate,
        payment_method: payment,
        rating: null,
      });
      return;
    }

    if (!supabaseConfigured || !user) return;

    void fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tier: selectedTier.name,
        pickup,
        dropoff: destination,
        distanceKm: est.distance,
        durationMin: est.duration,
        fare: fareFor(selectedTier),
        driverName: driver.name,
        driverRating: driver.rating,
        vehicle: driver.vehicle,
        plate: driver.plate,
        paymentMethod: payment,
      }),
    });
  }, [
    stage,
    saved,
    est,
    user,
    mode,
    selectedTier,
    pickup,
    destination,
    fareFor,
    driver,
    payment,
  ]);

  const reset = () => {
    setStage("idle");
    setDestination(null);
    setQuery("");
    setTripProgress(0);
    setRating(0);
    setSaved(false);
    setFast(false);
  };

  const fare = fareFor(selectedTier);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex items-center gap-3 text-[14px] text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          Loading your rider account…
        </div>
      </div>
    );
  }

  if (!user) {
    return <SignedOut />;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col-reverse bg-surface lg:flex-row">
      {/* Map */}
      <div className="relative h-[38vh] w-full lg:order-2 lg:h-[calc(100vh-64px)] lg:flex-1">
        <AccraMap
          showRoute={stage === "driver" || stage === "trip" || stage === "receipt"}
          progress={stage === "trip" ? tripProgress / 100 : stage === "receipt" ? 1 : 0.15}
          dropoffLabel={destination ?? undefined}
          pickupLabel={stage === "idle" ? `${pickup} · ${profile?.city ?? "Accra"}` : undefined}
        />
        {stage === "matching" && (
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[13px] font-medium text-white shadow-menu">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Finding your driver…
            </div>
          </div>
        )}
      </div>

      {/* Panel */}
      <aside className="relative z-10 w-full bg-white lg:order-1 lg:h-[calc(100vh-64px)] lg:w-[430px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-hair">
        <div className="p-5 sm:p-6">
          {(stage === "idle" || stage === "search") && (
            <IdlePanel
              profileName={profile?.full_name ?? "rider"}
              ridesCount={ridesCount}
              query={query}
              setQuery={(v) => {
                setQuery(v);
                setStage("search");
              }}
              suggestions={suggestions}
              savedPlaces={savedPlaces}
              onChoose={chooseDestination}
              onOpenSearch={() => setStage("search")}
            />
          )}

          {stage === "options" && destination && (
            <OptionsPanel
              pickup={pickup}
              destination={destination}
              setPickup={setPickup}
              tiers={tiers}
              fareFor={fareFor}
              selected={selectedTier}
              onSelect={setSelectedTier}
              payment={payment}
              onBack={() => {
                setStage("idle");
                setDestination(null);
              }}
              onRequest={requestRide}
              scheduled={params.get("schedule") === "1"}
            />
          )}

          {(stage === "matching" || stage === "driver") && destination && (
            <DriverPanel
              stage={stage}
              driver={driver}
              etaMin={etaMin}
              destination={destination}
              tier={selectedTier.name}
              onCancel={() => setStage("options")}
              fast={fast}
              setFast={setFast}
            />
          )}

          {stage === "trip" && destination && (
            <TripPanel
              progress={tripProgress}
              destination={destination}
              driver={driver}
              etaMin={est?.duration ?? 0}
              fast={fast}
              setFast={setFast}
            />
          )}

          {stage === "receipt" && destination && est && (
            <ReceiptPanel
              fare={fare}
              distance={est.distance}
              duration={est.duration}
              driver={driver}
              tier={selectedTier.name}
              payment={payment}
              rating={rating}
              setRating={setRating}
              onDone={reset}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function IdlePanel({
  profileName,
  ridesCount,
  query,
  setQuery,
  suggestions,
  savedPlaces,
  onChoose,
  onOpenSearch,
}: {
  profileName: string;
  ridesCount: number | null;
  query: string;
  setQuery: (v: string) => void;
  suggestions: { label: string; address: string }[];
  savedPlaces: { label: string; address: string; icon: "home" | "work" }[];
  onChoose: (label: string) => void;
  onOpenSearch: () => void;
}) {
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    );
  }, []);

  return (
    <div className="animate-fade-up">
      <p className="text-[13px] text-muted">
        {greeting}, {profileName.split(" ")[0]}
      </p>
      <h1 className="mt-1 text-[27px] font-semibold leading-tight tracking-[-0.03em]">
        Where to?
      </h1>

      <button
        onClick={onOpenSearch}
        className="mt-5 flex h-[52px] w-full items-center gap-3 rounded-lg bg-surface px-4 text-left"
      >
        <Search className="text-muted" />
        <span className="text-[15px] text-subtle">Enter your destination</span>
      </button>

      <div className="mt-4 space-y-1">
        {savedPlaces.map((p) => (
          <button
            key={p.label}
            onClick={() => onChoose(p.address)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-surface"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-hair">
              {p.icon === "home" ? <Home width={17} height={17} /> : <Briefcase width={17} height={17} />}
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-medium">{p.label}</span>
              <span className="block truncate text-[13px] text-muted">{p.address}</span>
            </span>
            <ChevronRight width={16} height={16} className="ml-auto text-subtle" />
          </button>
        ))}
      </div>

      <div className="divider my-4" />

      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.1em] text-subtle">
        Recent
      </p>
      <div className="space-y-1">
        {RECENT_DESTINATIONS.map((r) => (
          <button
            key={r.label}
            onClick={() => onChoose(r.label)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-surface"
          >
            <Clock width={16} height={16} className="text-subtle" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px]">{r.label}</span>
              <span className="block truncate text-[12px] text-subtle">{r.address}</span>
            </span>
            <ChevronRight width={15} height={15} className="text-subtle" />
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/reserve"
          className="rounded-lg border border-hair p-4 transition-colors hover:bg-surface"
        >
          <Calendar width={20} height={20} />
          <p className="mt-3 text-[14px] font-semibold">Reserve</p>
          <p className="mt-0.5 text-[12px] leading-snug text-muted">Book up to 90 days ahead</p>
        </Link>
        <Link
          href="/activity"
          className="rounded-lg border border-hair p-4 transition-colors hover:bg-surface"
        >
          <Clock width={20} height={20} />
          <p className="mt-3 text-[14px] font-semibold">Activity</p>
          <p className="mt-0.5 text-[12px] leading-snug text-muted">
            {ridesCount === null ? "Your ride history" : `${ridesCount} trips on this account`}
          </p>
        </Link>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-lg bg-surface p-3.5">
        <Shield width={18} height={18} className="mt-0.5 shrink-0" />
        <p className="text-[12px] leading-relaxed text-muted">
          Every trip includes a safety toolkit with emergency assistance and live
          trip sharing.
        </p>
      </div>
    </div>
  );
}

function OptionsPanel({
  pickup,
  destination,
  setPickup,
  tiers,
  fareFor,
  selected,
  onSelect,
  payment,
  onBack,
  onRequest,
  scheduled,
}: {
  pickup: string;
  destination: string;
  setPickup: (v: string) => void;
  tiers: Tier[];
  fareFor: (t: Tier) => number;
  selected: Tier;
  onSelect: (t: Tier) => void;
  payment: string;
  onBack: () => void;
  onRequest: () => void;
  scheduled: boolean;
}) {
  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-[13px] text-muted hover:text-black"
      >
        <ChevronLeft width={16} height={16} /> Back
      </button>

      <div className="rounded-lg bg-surface p-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Crosshair width={16} height={16} className="text-muted" />
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full bg-transparent text-[14px] outline-none"
            aria-label="Pickup location"
          />
        </div>
        <div className="mx-2 h-px bg-line" />
        <div className="flex items-center gap-3 px-2 py-1.5">
          <CircleDot width={16} height={16} className="text-muted" />
          <p className="truncate text-[14px]">{destination}</p>
        </div>
      </div>

      {scheduled && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-hair px-3 py-2.5 text-[13px]">
          <Calendar width={16} height={16} />
          Scheduled ride · pick a time at checkout
        </div>
      )}

      <h2 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">
        Choose a ride
      </h2>

      <div className="mt-3 space-y-2">
        {tiers.map((t) => {
          const active = t.id === selected.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                active
                  ? "border-black bg-surface shadow-[inset_0_0_0_1px_#000]"
                  : "border-hair hover:bg-surface"
              }`}
            >
              <span className="grid h-11 w-14 shrink-0 place-items-center">
                <TierGlyph id={t.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold">{t.name}</span>
                  <span className="rounded bg-black/[.06] px-1.5 py-0.5 text-[10px] font-medium text-muted">
                    {t.seats} seats
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-muted">
                  {t.eta} away · {t.blurb}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-[15px] font-semibold">
                  {shortGHS(fareFor(t))}
                </span>
                <span className="block text-[11px] text-subtle">{t.eta}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button className="mt-3 flex w-full items-center gap-3 rounded-lg border border-hair p-3 text-left hover:bg-surface">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white">
          <Card width={17} height={17} />
        </span>
        <span className="flex-1">
          <span className="block text-[13px] font-medium">{payment}</span>
          <span className="block text-[12px] text-muted">Personal · default</span>
        </span>
        <ChevronRight width={16} height={16} className="text-subtle" />
      </button>

      <button onClick={onRequest} className="btn btn-primary mt-5 w-full">
        {scheduled ? "Schedule " : "Request "} {selected.name}
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-subtle">
        Charges are estimates and may change based on traffic, tolls and waiting time.
      </p>
    </div>
  );
}

function TierGlyph({ id }: { id: string }) {
  if (id === "uberxl") {
    return (
      <svg width="52" height="30" viewBox="0 0 52 30" fill="none" aria-hidden>
        <path d="M5 21v-5l3-7a3 3 0 012.8-2h20.4A3 3 0 0134 9l3 7v5" stroke="#111" strokeWidth="1.6" />
        <circle cx="13" cy="22" r="2.6" stroke="#111" strokeWidth="1.6" />
        <circle cx="39" cy="22" r="2.6" stroke="#111" strokeWidth="1.6" />
        <path d="M5 16h34" stroke="#111" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "comfort") {
    return (
      <svg width="52" height="30" viewBox="0 0 52 30" fill="none" aria-hidden>
        <path d="M8 21v-5l2.6-6a2.6 2.6 0 012.4-1.6h14.8A2.6 2.6 0 0130.2 10L33 16v5" stroke="#111" strokeWidth="1.6" />
        <circle cx="14.5" cy="22" r="2.4" stroke="#111" strokeWidth="1.6" />
        <circle cx="30.5" cy="22" r="2.4" stroke="#111" strokeWidth="1.6" />
        <path d="M8 16h25" stroke="#111" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "share") {
    return (
      <svg width="52" height="30" viewBox="0 0 52 30" fill="none" aria-hidden>
        <circle cx="16" cy="10" r="4" stroke="#111" strokeWidth="1.6" />
        <circle cx="32" cy="10" r="4" stroke="#111" strokeWidth="1.6" />
        <path d="M8 24c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5M24 24c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke="#111" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg width="52" height="30" viewBox="0 0 52 30" fill="none" aria-hidden>
      <path d="M6 21v-5l3.4-7.4A2 2 0 0111.2 7.4h17.6a2 2 0 011.8 1.2L34 16v5" stroke="#111" strokeWidth="1.6" />
      <circle cx="14" cy="22" r="2.6" stroke="#111" strokeWidth="1.6" />
      <circle cx="32" cy="22" r="2.6" stroke="#111" strokeWidth="1.6" />
      <path d="M6 16h28" stroke="#111" strokeWidth="1.6" />
    </svg>
  );
}

function DriverPanel({
  stage,
  driver,
  etaMin,
  destination,
  tier,
  onCancel,
  fast,
  setFast,
}: {
  stage: Stage;
  driver: (typeof DRIVERS)[number];
  etaMin: number;
  destination: string;
  tier: string;
  onCancel: () => void;
  fast: boolean;
  setFast: (v: boolean) => void;
}) {
  return (
    <div className="animate-fade-up">
      {stage === "matching" ? (
        <div className="py-8 text-center">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <span className="absolute inset-0 animate-pulseRing rounded-full bg-black/10" />
            <span className="absolute inset-3 animate-pulseRing rounded-full bg-black/10 [animation-delay:.6s]" />
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-black text-white">
              <Car />
            </span>
          </div>
          <h2 className="mt-6 text-[21px] font-semibold tracking-[-0.02em]">
            Finding your driver
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Matching you with a nearby {tier} heading to
            <br />
            <span className="font-medium text-black">{destination}</span>
          </p>
          <button onClick={onCancel} className="btn btn-secondary mt-6 w-full">
            Cancel request
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
              {etaMin <= 1 ? "Arriving now" : `Arriving in ${etaMin} min`}
            </span>
            <button
              onClick={() => setFast(true)}
              className="text-[11px] text-subtle underline underline-offset-2 hover:text-black"
            >
              {fast ? "Fast-forwarding" : "Fast-forward demo"}
            </button>
          </div>

          <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.02em]">
            {driver.name.split(" ")[0]} is on the way
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            {driver.vehicle} · {driver.plate}
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-lg bg-surface p-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-black text-[16px] font-semibold text-white">
              {driver.name.split(" ").map((w) => w[0]).join("")}
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-semibold">{driver.name}</p>
              <p className="flex items-center gap-1 text-[13px] text-muted">
                <StarFilled width={13} height={13} className="text-black" />
                {driver.rating.toFixed(2)} · 3,281 trips
              </p>
            </div>
            <div className="flex gap-2">
              <button
                aria-label="Call driver"
                className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card hover:bg-hair"
              >
                <Phone width={17} height={17} />
              </button>
              <button
                aria-label="Message driver"
                className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card hover:bg-hair"
              >
                <Sparkle width={17} height={17} />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-hair p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-subtle">
              Your trip
            </p>
            <div className="mt-3 flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
                <span className="my-1 w-px flex-1 bg-line" />
                <span className="h-2.5 w-2.5 rounded-full border-2 border-black" />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-[14px]">Current location</p>
                <p className="text-[14px] font-medium">{destination}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-surface p-3.5">
            <Shield width={18} height={18} className="mt-0.5" />
            <p className="text-[12px] leading-relaxed text-muted">
              Verify the licence plate <strong className="text-black">{driver.plate}</strong>{" "}
              before you get in, and share your trip with a contact.
            </p>
          </div>

          <button onClick={onCancel} className="btn btn-secondary mt-4 w-full">
            Cancel ride
          </button>
        </>
      )}
    </div>
  );
}

function TripPanel({
  progress,
  destination,
  driver,
  etaMin,
  fast,
  setFast,
}: {
  progress: number;
  destination: string;
  driver: (typeof DRIVERS)[number];
  etaMin: number;
  fast: boolean;
  setFast: (v: boolean) => void;
}) {
  const remaining = Math.max(1, Math.round(etaMin * (1 - progress / 100)));
  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-good px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          On trip
        </span>
        <button
          onClick={() => setFast(true)}
          className="text-[11px] text-subtle underline underline-offset-2 hover:text-black"
        >
          {fast ? "Fast-forwarding" : "Fast-forward demo"}
        </button>
      </div>

      <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.02em]">
        {remaining} min to {destination.split(",")[0]}
      </h2>
      <p className="mt-1 text-[14px] text-muted">
        {driver.name.split(" ")[0]} is driving you there.
      </p>

      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-hair">
          <div
            className="h-full rounded-full bg-black transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[12px] text-subtle">
          <span>Pickup</span>
          <span>{destination.split(",")[0]}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-lg bg-surface p-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-[14px] font-semibold text-white">
          {driver.name.split(" ").map((w) => w[0]).join("")}
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold">{driver.name}</p>
          <p className="text-[13px] text-muted">
            {driver.vehicle} · {driver.plate}
          </p>
        </div>
        <StarFilled width={16} height={16} />
        <span className="text-[13px] font-medium">{driver.rating.toFixed(2)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="btn btn-secondary text-[13px]">Share trip</button>
        <button className="btn btn-secondary text-[13px]">Safety</button>
      </div>
    </div>
  );
}

function ReceiptPanel({
  fare,
  distance,
  duration,
  driver,
  tier,
  payment,
  rating,
  setRating,
  onDone,
}: {
  fare: number;
  distance: number;
  duration: number;
  driver: (typeof DRIVERS)[number];
  tier: string;
  payment: string;
  rating: number;
  setRating: (n: number) => void;
  onDone: () => void;
}) {
  const [tip, setTip] = useState(0);
  const total = fare + tip;

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-good text-white">
          <Check width={15} height={15} />
        </span>
        <span className="text-[12px] font-semibold uppercase tracking-[.1em] text-muted">
          Trip completed
        </span>
      </div>

      <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.02em]">
        You&apos;ve arrived
      </h2>
      <p className="mt-1 text-[14px] text-muted">
        Thanks for riding with {driver.name.split(" ")[0]}.
      </p>

      <div className="mt-5 rounded-lg border border-hair p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] text-muted">{tier}</p>
          <p className="text-[22px] font-semibold">{shortGHS(total)}</p>
        </div>
        <div className="mt-3 space-y-1.5 text-[13px]">
          <Row label="Trip fare" value={shortGHS(fare)} />
          <Row label="Distance" value={`${distance.toFixed(1)} km`} />
          <Row label="Duration" value={`${duration} min`} />
          {tip > 0 && <Row label="Tip" value={shortGHS(tip)} />}
          <Row label="Paid with" value={payment} />
        </div>
      </div>

      <p className="mt-5 text-[13px] font-medium">Add a tip</p>
      <div className="mt-2 flex gap-2">
        {[0, 2, 5, 10].map((t) => (
          <button
            key={t}
            onClick={() => setTip(t)}
            className={`h-9 flex-1 rounded-lg border text-[13px] font-medium transition-colors ${
              tip === t ? "border-black bg-black text-white" : "border-hair hover:bg-surface"
            }`}
          >
            {t === 0 ? "No tip" : shortGHS(t)}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[13px] font-medium">How was your ride?</p>
      <div className="mt-2 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="transition-transform hover:scale-110"
          >
            {n <= rating ? (
              <StarFilled width={30} height={30} />
            ) : (
              <Star width={30} height={30} className="text-black/25" />
            )}
          </button>
        ))}
      </div>

      <button onClick={onDone} className="btn btn-primary mt-6 w-full">
        Done
      </button>
      <Link href="/activity" className="btn btn-ghost mt-2 w-full text-[13px]">
        View receipt in activity
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SignedOut() {
  return (
    <div className="grid min-h-[calc(100vh-64px)] place-items-center bg-surface px-5">
      <div className="w-full max-w-[420px] rounded-xl2 bg-white p-8 shadow-card">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-white">
          <Pin />
        </span>
        <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.02em]">
          Log in to book a ride
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          See prices, request a ride, and track your driver. Your saved places and
          trip history live in your account.
        </p>
        <Link href="/login" className="btn btn-primary mt-6 w-full">
          Log in
        </Link>
        <Link href="/signup" className="btn btn-secondary mt-2 w-full">
          Create an account
        </Link>
        <Link
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-muted hover:text-black"
        >
          Back to uber.com <ArrowRight width={14} height={14} />
        </Link>
      </div>
    </div>
  );
}
