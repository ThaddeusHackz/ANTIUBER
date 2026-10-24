"use client";

/**
 * Offline rider store.
 *
 * The real backend is Supabase (see lib/seed.ts and the ride_* tables).
 * Sandboxes and previews with restricted egress cannot reach *.supabase.co,
 * so this module mirrors the same shape in localStorage. It is only used
 * when the Supabase probe fails or the rider explicitly chooses demo access.
 */

import type { PaymentMethod, RideRow } from "@/lib/types";

const KEY = "antiuber.demo.v1";
const EVENT = "antiuber-demo-change";

export type DemoProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  rating: number;
};

export type DemoState = {
  signedIn: boolean;
  profile: DemoProfile;
  rides: RideRow[];
  places: { id: string; label: string; address: string; icon: string }[];
  payments: PaymentMethod[];
};

export const DEMO_PROFILE: DemoProfile = {
  id: "demo-rider",
  full_name: "Ama Owusu",
  email: "rider@antiuber.demo",
  phone: "+233 24 555 0192",
  city: "Accra, GH",
  rating: 4.92,
};

const DAY = 86_400_000;
const now = Date.now();

const seedRides = (): RideRow[] => [
  {
    id: "demo-ride-1",
    user_id: DEMO_PROFILE.id,
    status: "completed",
    tier: "UberX",
    pickup: "12 Independence Ave, Accra",
    dropoff: "Kotoka International Airport",
    distance_km: 8.4,
    duration_min: 24,
    fare: 62.4,
    currency: "GHS",
    driver_name: "Kwame Mensah",
    driver_rating: 4.94,
    vehicle: "Toyota Corolla · Silver",
    plate: "GR-4821-24",
    payment_method: "Visa •••• 4242",
    rating: 5,
    requested_at: new Date(now - DAY * 1.2).toISOString(),
    completed_at: new Date(now - DAY * 1.19).toISOString(),
  },
  {
    id: "demo-ride-2",
    user_id: DEMO_PROFILE.id,
    status: "completed",
    tier: "Comfort",
    pickup: "Stanbic Heights, Airport City",
    dropoff: "Osu Oxford Street",
    distance_km: 6.1,
    duration_min: 19,
    fare: 54.8,
    currency: "GHS",
    driver_name: "Ama Boateng",
    driver_rating: 4.98,
    vehicle: "Hyundai Elantra · Black",
    plate: "GR-9931-23",
    payment_method: "Uber Cash",
    rating: 5,
    requested_at: new Date(now - DAY * 4).toISOString(),
    completed_at: new Date(now - DAY * 4 + 1_140_000).toISOString(),
  },
  {
    id: "demo-ride-3",
    user_id: DEMO_PROFILE.id,
    status: "completed",
    tier: "UberXL",
    pickup: "Accra Mall, Spintex Rd",
    dropoff: "Labadi Beach",
    distance_km: 11.7,
    duration_min: 34,
    fare: 96.3,
    currency: "GHS",
    driver_name: "Yaw Owusu",
    driver_rating: 4.91,
    vehicle: "Toyota Sienna · White",
    plate: "GE-2210-22",
    payment_method: "Visa •••• 4242",
    rating: 4,
    requested_at: new Date(now - DAY * 9).toISOString(),
    completed_at: new Date(now - DAY * 9 + 2_040_000).toISOString(),
  },
  {
    id: "demo-ride-4",
    user_id: DEMO_PROFILE.id,
    status: "cancelled",
    tier: "UberX",
    pickup: "Jamestown Lighthouse",
    dropoff: "Kwame Nkrumah Circle",
    distance_km: 3.2,
    duration_min: 11,
    fare: 0,
    currency: "GHS",
    driver_name: "—",
    driver_rating: 0,
    vehicle: "—",
    plate: "—",
    payment_method: "Visa •••• 4242",
    rating: null,
    requested_at: new Date(now - DAY * 13).toISOString(),
    completed_at: null,
  },
];

const seedPlaces = () => [
  { id: "demo-place-1", label: "Home", address: "12 Independence Ave, Accra", icon: "home" },
  { id: "demo-place-2", label: "Work", address: "Stanbic Heights, Airport City", icon: "work" },
];

const seedPayments = (): PaymentMethod[] => [
  { id: "demo-pay-1", kind: "card", brand: "Visa", last4: "4242", exp: "09/29", is_default: true },
  { id: "demo-pay-2", kind: "wallet", brand: "Uber Cash", last4: "", exp: "", is_default: false },
];

const fresh = (): DemoState => ({
  signedIn: false,
  profile: { ...DEMO_PROFILE },
  rides: seedRides(),
  places: seedPlaces(),
  payments: seedPayments(),
});

export function readDemo(): DemoState {
  if (typeof window === "undefined") return fresh();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const init = fresh();
      window.localStorage.setItem(KEY, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      signedIn: Boolean(parsed.signedIn),
      profile: { ...DEMO_PROFILE, ...(parsed.profile ?? {}) },
      rides: parsed.rides ?? seedRides(),
      places: parsed.places ?? seedPlaces(),
      payments: parsed.payments ?? seedPayments(),
    };
  } catch {
    return fresh();
  }
}

function write(next: DemoState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function onDemoChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function signInDemo() {
  const state = readDemo();
  write({ ...state, signedIn: true });
}

export function signOutDemo() {
  const state = readDemo();
  write({ ...state, signedIn: false });
}

export function addDemoRide(
  ride: Omit<RideRow, "id" | "user_id" | "requested_at" | "completed_at">
) {
  const state = readDemo();
  const row: RideRow = {
    ...ride,
    id: `demo-ride-${Date.now()}`,
    user_id: DEMO_PROFILE.id,
    requested_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  };
  write({ ...state, rides: [row, ...state.rides] });
  return row;
}

export function rateDemoRide(id: string, rating: number) {
  const state = readDemo();
  write({
    ...state,
    rides: state.rides.map((r) => (r.id === id ? { ...r, rating } : r)),
  });
}

export function updateDemoProfile(patch: Partial<DemoProfile>) {
  const state = readDemo();
  write({ ...state, profile: { ...state.profile, ...patch } });
}

export function addDemoPayment(pm: Omit<PaymentMethod, "id" | "is_default">) {
  const state = readDemo();
  const row: PaymentMethod = {
    ...pm,
    id: `demo-pay-${Date.now()}`,
    is_default: false,
  };
  write({ ...state, payments: [...state.payments, row] });
  return row;
}

export function setDemoDefaultPayment(id: string) {
  const state = readDemo();
  write({
    ...state,
    payments: state.payments.map((p) => ({ ...p, is_default: p.id === id })),
  });
}
